# Monday Shareable Dashboard Backend

This app allows Monday.com account holders to navigate to a dashboard and provide a link to a static copy of the dashboard for public use.

## Available Scripts

In the project directory, you can run:
Use command `npm start` to run the app in development.

### Building Docker image

Build the docker image [aussidavid/moday_shareable_dashboard_frontend](https://hub.docker.com/r/aussidavid/monday_shareable_dashboard_frontend) to host the app as a static website.

```bash
$ docker-compose build
[+] Building 50.8s (16/16) FINISHED                                                                                                         
 => [internal] load build definition from Dockerfile                                                                                   0.0s
 .
 .
 .
 => => writing image sha256:72e77c55f7fa90c2898ea59a3e00cfc3ac97fce90b9f305efaf3c1970dd8cc5b                                           0.0s
 => => naming to docker.io/aussidavid/monday_shareable_dashboard_backend  
```

### Deploying the Docker image

To deploy the the app run:

```bash
$ cat docker-compose.prod.yml | ssh $HOST stack deploy --prune -c - shareable_dashboard_backend

Updating service shareable_dashboard_backend_app (id: mrsisw1f22eh3ty4og8auvd3d)
```
