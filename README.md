# Invana Search Engine

A simple search engine to browse the data that is crawled.

This can be accessed at [https://invanalabs.github.io/search-engine/index.html](https://invanalabs.github.io/search-engine/index.html)


### Enabling CORS on Elasticsearch Node

For local installation, update the configuration in `/usr/local/etc/elasticsearch/elasticsearch.yml`. 
Add the configuration 

```yaml
# /usr/local/etc/elasticsearch/elasticsearch.yml or relevant path
http.cors.enabled: true
http.cors.allow-origin: "*" # look at security advice below
```

**NOTE: Please use the domain instead of * for http.cors.allow-origin for security purposes.**
If you are using this search engine UI from `invanalabs.github.io`, use the same for allow-origin.

Restart the service with `brew services restart elasticsearch`