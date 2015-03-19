package com.piotrkafel;

import com.piotrkafel.controller.JsonEqualityController;
import com.piotrkafel.transformer.JsonTransformer;

import static spark.Spark.post;
import static spark.Spark.staticFileLocation;

public class WebInitializer {

    public static void main(String[] args) {

        staticFileLocation("/public");

        post("/json/compare", "application/json", new JsonEqualityController(), new JsonTransformer());
    }
}