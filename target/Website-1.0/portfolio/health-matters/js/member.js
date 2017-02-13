/*
    Group Project - Health Matters!
    Student Names: Yoonkwan Kim, Jody Kirton, Nicole Serrao
*/

"use strict";

// data object : data.member
function initMember(json) {
    data.member = json;
    console.log("init-member", json);
    registerMemberClickEvent();
}

function registerMemberClickEvent() {
    $(".nav-member").click(function() {
        var num = $(this).attr("value");
        $("#sName").html(data.member.member[num].fullName);
        $("#sLog").html(data.member.member[num].studentLogin);
        $("#sNum").html(data.member.member[num].studentNumber);
        $(".memberPics")
            .html("<img id='memberPic' src='" +  data.member.member[num].studentPicture + "'>");
    });
}

/**
 * Initialize member-details page When an item is clicked
 *
 * @param item used for member-details page
 */
function initMemberDetails(item) {

    console.log("init member-details", item);
}
