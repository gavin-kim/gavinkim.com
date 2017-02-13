/*
    Group Project - Health Matters!
    Student Names: Yoonkwan Kim, Jody Kirton, Nicole Serrao
*/

"use strict";

// data object : data.mineral

function initMineral(xml) {

    // save the xml to data object
    data.mineral = xml;

    // create a list
    var mineralList = $("#mineral-list");
    $(data.mineral).find("phrase-group").each(function(index, item) {

        mineralList.append($("<li></li>").html(
            "<a href='#mineral-details'>" + $(item).find("phrase").text() + "</a>"

            // add a click event it will be invoked with item when the button's clicked
            ).click(function() {
                MINERAL.clickEvent = initMineralDetails;
                MINERAL.item = item;
            })
        )
    });

    mineralList.listview("refresh");
}


/**
 * Initialize mineral-details page When an item is clicked
 *
 * @param item used for mineral-detail page
 */
function initMineralDetails(item) {

    $("#mineral-details-header")
        .html("<h1>" + $(item).find("phrase").text() +"</h1>");

    $("#mineral-details-img").attr("src", $(item).find("image").text());

    $("#mineral-details-info")
        .html($(item).find("meaning").text());

    //registerMemberClickEvent();
}
