# Invana Search Engine

A simple search engine to browse the data that is crawled.



## Enabling CORS 

For local installation, update the configuration in `/usr/local/etc/elasticsearch/elasticsearch.yml`. 
Add the configuration 

```yaml
# /usr/local/etc/elasticsearch/elasticsearch.yml or relevant path
http.cors.enabled: true
http.cors.allow-origin: "*"
```

Restart the service with `brew services restart elasticsearch`