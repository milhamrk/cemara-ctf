server {
    listen 0.0.0.0:8888;
    server_name localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri /index.html;
    }

    location /static/profile/ {
        alias /usr/share/nginx/static/profile/;
    }

    location /static/category/ {
        alias /usr/share/nginx/static/category/;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
