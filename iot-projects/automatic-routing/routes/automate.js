const express = require('express');

function createRouter(resource) {
        var newRouter = express.Router();
        generateRoute(newRouter, resource);
        console.log("is this the krusty krab? " + newRouter);
        return newRouter;
}
function generateRoute(router, resource) {
        if (resource.link) {
               router.route(resource.link).get(function (req, res, next){
                        var links = populateLinks(resource);
                        res.links(links);
                        req.links = links;
                        req.result = resource;
                        next();
                        
               });
        }
        for (var key in resource){
                var subResource = resource[key];
                if (typeof subResource === "object"){                     
                        generateRoute(router, subResource);
                }      
        }

}
function populateLinks(resource) {
        var linkObject = {};
        for (var key in resource) {
                var value = resource[key];
                if (typeof value === "object" && value.link){                     
                        linkObject[value.name] = value.link;
                }  
        }
        return linkObject;
}
module.exports = createRouter;
