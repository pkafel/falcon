package com.piotrkafel;

import org.json.JSONException;
import org.json.JSONObject;
import org.skyscreamer.jsonassert.JSONAssert;

import static spark.Spark.post;
import static spark.Spark.staticFileLocation;

public class HelloWorld {

    public static void main(String[] args) {

        staticFileLocation("/public");

        post("/compare", (request, respone) -> {
            String json1 = request.queryParams("message1");
            String json2 = request.queryParams("message2");

            final JSONObject firstJson = new JSONObject(json1);
            final JSONObject secondJson = new JSONObject(json2);

            return areJsonsEqual(firstJson, secondJson);
        });
    }

    private static boolean areJsonsEqual(JSONObject firstJson, JSONObject secondJson) {
        try {
            JSONAssert.assertEquals(firstJson, secondJson, true);
            return true;
        } catch (JSONException | AssertionError e) {
            return false;
        }
    }
}