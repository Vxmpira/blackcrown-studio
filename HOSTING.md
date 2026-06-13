# HOSTING: run the admin on your EC2, behind the scenes

Goal: a private admin at `https://admin.blackcrownvxj.com` on the same server
that serves your site. The page is locked behind a login. The Export button
fires a render on AWS Lambda and returns an MP4 link.

Your site folder `/var/www/blackcrown` stays untouched. The studio lives in its
own folder. This also fixes the "could not determine executable to run" error:
that command only works inside this project, not in `/var/www/blackcrown`.

Run everything below over SSH on the EC2 (the same box, IP 3.144.125.222).

## 1. Install Node (once)

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v       # expect v20.x
```

Optional but recommended on a t3.micro so builds don't run out of memory:
```
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
```

## 2. Get the studio onto the box

Put the `blackcrown-studio` folder at `/home/ubuntu/blackcrown-studio` (push it
to a private repo and clone it, or upload the zip and unzip). Then:

```
cd /home/ubuntu/blackcrown-studio
npm install
```

## 3. AWS setup (run these HERE, in the project)

This is where your earlier command belongs. Inside the project:

```
npx remotion lambda policies role
```
Copy the JSON into an IAM policy named exactly `remotion-lambda-policy`, then
create the role and user as in RUNBOOK.md (use `npx remotion lambda policies
user` for the user policy). Create the access key.

Then create `.env`:
```
cp .env.example .env
nano .env        # paste keys, set REMOTION_AWS_REGION=us-east-2
```

Deploy the renderer and your ads (still in the project):
```
npm run deploy:fn       # copy the function name into .env
npm run deploy:site     # copy the Serve URL into .env
```

## 4. Build the admin page

```
npm run build           # produces ./dist
```

## 5. Run the render service in the background (systemd)

Create the service file at `/etc/systemd/system/blackcrown-render.service`:
```
sudo nano /etc/systemd/system/blackcrown-render.service
```
Paste:
```
[Unit]
Description=BlackCrown render service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/blackcrown-studio
EnvironmentFile=/home/ubuntu/blackcrown-studio/.env
Environment=PORT=3001
ExecStart=/usr/bin/node server.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
Start it:
```
sudo systemctl daemon-reload
sudo systemctl enable --now blackcrown-render
sudo systemctl status blackcrown-render     # should say active (running)
```

## 6. Point a subdomain at the box

In Route 53, add an A record: `admin.blackcrownvxj.com` -> `3.144.125.222`.

## 7. Lock it behind a login (Basic Auth)

```
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd-admin youradminname
```

## 8. Nginx site for the admin

Create `/etc/nginx/sites-available/admin.blackcrownvxj.com`:
```
server {
    listen 80;
    server_name admin.blackcrownvxj.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name admin.blackcrownvxj.com;

    root /home/ubuntu/blackcrown-studio/dist;
    index index.html;

    auth_basic "BlackCrown Admin";
    auth_basic_user_file /etc/nginx/.htpasswd-admin;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 600s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Enable it and get HTTPS:
```
sudo ln -s /etc/nginx/sites-available/admin.blackcrownvxj.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d admin.blackcrownvxj.com
```

## Done

Open `https://admin.blackcrownvxj.com`, log in, go to Ad Studio, pick an ad,
Render & export, download the MP4.

## When you change ads later

Edit `src/remotion/data.ts`, then on the box:
```
cd /home/ubuntu/blackcrown-studio
npm run build           # refresh the page
npm run deploy:site     # refresh the cloud renderer
```

## Security notes

- The login (Basic Auth) covers both the page and the render API, so nobody can
  trigger paid renders without it. Keep that password strong.
- Your AWS keys live only in `.env` on the server. Never commit `.env`.
- The render service only fires Lambda renders. The heavy work runs on Lambda,
  so this stays light on the t3.micro.
