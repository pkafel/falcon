package com.piotrkafel.controller;

import org.json.JSONException;
import org.json.JSONObject;
import org.skyscreamer.jsonassert.JSONAssert;
import spark.Request;
import spark.Response;
import spark.Route;

public class JsonEqualityController implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String json1 = request.queryParams("message1");
        String json2 = request.queryParams("message2");

        final JSONObject firstJson = new JSONObject(json1);
        final JSONObject secondJson = new JSONObject(json2);

        return areJsonsEqual(firstJson, secondJson);
    }

    private boolean areJsonsEqual(JSONObject firstJson, JSONObject secondJson) {
        try {
            JSONAssert.assertEquals(firstJson, secondJson, true);
            return true;
        } catch (JSONException | AssertionError e) {
            return false;
        }
    }
}
