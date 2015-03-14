package com.piotrkafel;

import static spark.Spark.*;

import org.json.JSONException;
import org.json.JSONObject;
import org.skyscreamer.jsonassert.JSONAssert;

public class HelloWorld {

    public static void main(String[] args) {

        get("/hello", (request, response) -> "Hello World!");

        post("/compare", (request, respone) -> {
            final String body = request.body();
            final JSONObject jsonObject = new JSONObject(body);
            final JSONObject firstJson = jsonObject.getJSONObject("firstJson");
            final JSONObject secondJson = jsonObject.getJSONObject("secondJson");

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