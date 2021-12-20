# habr_node_http_servers

App to test Google AppEngine - what HTTP version is compatible with GAE.

GAE can server web apps with
HTTP/1.1 [only](https://cloud.google.com/appengine/docs/standard/nodejs/how-requests-are-handled).

Module `Gae_Back_Cli_Start` starts web server in GAE compatible mode.

Deploy & browse service:

```shell
$ gcloud app deploy
$ gcloud app browse
```
