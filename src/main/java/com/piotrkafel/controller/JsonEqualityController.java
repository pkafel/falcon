package com.piotrkafel.controller;

import com.piotrkafel.model.JsonEqualityResponse;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.skyscreamer.jsonassert.JSONCompareResult;
import spark.Request;
import spark.Response;
import spark.Route;

import static org.skyscreamer.jsonassert.JSONCompare.compareJSON;

public class JsonEqualityController implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        response.type("application/json");
        String json1 = request.queryParams("json1");
        String json2 = request.queryParams("json2");

        JSONCompareResult result = compareJSON(json1, json2, JSONCompareMode.STRICT);
        response.type("application/json");
        return new JsonEqualityResponse(result.passed());
    }
}
