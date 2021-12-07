# habr_node_http_servers

This repo contains 2 servers based on node libs `http` & `http2` ([./http1.mjs](./http1.mjs)
& [./http2.mjs](./http2.mjs)). Both servers have common functionality placed in [./lib.mjs](./lib.mjs). Simple web app
in [./pub/index.html](./pub/index.html) allows uploading files to `./pub/` folder (one folder for both servers), get
listing of uploaded files, remove selected files.

It demonstrates basic HTTP possibilities:

* handing out static files (GET requests);
* files uploading;
* Server Sent Events (listing generation);
* files removal (POST requests);

Clone this repo to your computer then start the servers:

```shell
$ node http1.mjs & 
$ node http2.mjs & 
```

These servers use `nodejs` functionality only. You don't need to install any external `npm` packages.

Go to web apps:

* http://localhost:4010/index.html
* https://localhost:4020/index.html

HTTP/2 server use self-signed certificate (`NET::ERR_CERT_AUTHORITY_INVALID`), so you need to allow `unsafe`. 
