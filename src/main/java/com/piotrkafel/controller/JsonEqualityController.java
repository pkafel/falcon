package com.piotrkafel.controller;

import org.skyscreamer.jsonassert.JSONCompareMode;
import org.skyscreamer.jsonassert.JSONCompareResult;
import spark.Request;
import spark.Response;
import spark.Route;

import static org.skyscreamer.jsonassert.JSONCompare.compareJSON;

public class JsonEqualityController implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String json1 = request.queryParams("message1");
        String json2 = request.queryParams("message2");

        JSONCompareResult result = compareJSON(json1, json2, JSONCompareMode.STRICT);
        return result.passed();
    }
}
