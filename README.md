# Invana Search Engine

A simple search engine to browse the data that is crawled.

This can be accessed at [https://invanalabs.github.io/data-browser/index.html](https://invanalabs.github.io/data-browser/index.html)



### Example setup

```
https://invanalabs.github.io/data-browser/settings.html?search_url_base=https://search-test-es-server-ubrk5p4645nrfq235wuzi4g6ku.ap-south-1.es.amazonaws.com/blogs/github/_search&search_fields=title&heading_field=url&subheading_field=domain&summary_field=description&result_size=10

# This url will setup the settings needed for browser.
```

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
