# Falcon - the greatest JSON util project #

### Current functionality ###

* Check if two JSONs are equal
* ...

### How do I get set up? ###

+ Just run `WebInitializer` class and after that you can use Falcon front end or curl against it REST API:
     * frontend can be found under: `localhost:4567/index.htm`
     * in order to use REST API use the following command `curl -X POST localhost:4567/json/compare -d 'message1={"a":1, "b":3}&message2={"b":3, "a":2}' -v`