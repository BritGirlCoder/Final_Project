/// <reference path="jquery-1.9.1.js" />
'use strict'

//Variables
var users = [];
var items = [];
var loggedin;

//***OBJECTS

//User constructor
var User = function (_fullName, _username, _password, _phone, _street, _city, _state, _zip) {
    this.fullName = _fullName;
    this.username = _username;
    this.password = _password;
    this.phone = _phone;
    this.street = _street;
    this.city = _city;
    this.state = _state;
    this.zip = _zip;
}

//Item constructor
var Item = function (_userName, _itemName, _itemDesc, _itemLocation, _itemLocationIndex, _itemBox, _itemPhoto) {
    this.userName = _userName;
    this.itemName = _itemName;
    this.itemDesc = _itemDesc;
    this.itemLocation = _itemLocation;
    this.itemLocationIndex = _itemLocationIndex
    this.itemBox = _itemBox;
    this.itemPhoto = _itemPhoto;
}

//***LOGIN

//Login
function logIn() {
    //Grab info from the login input boxes
    var loginUser = document.getElementById("loginUserName").value;
    var loginPassword = document.getElementById("loginPassword").value;
    var currentUser = new User;
    users = jsonParse('usersArray');
    
    //Verify the username & password exist if not blank
    if ((loginUser != "") && (loginPassword != "") && (users != null)) {
        //loop through each user object
        for (var i = 0; i < users.length; i++) {

            if ((loginUser == users[i].username) && (loginPassword == users[i].password)) {

                currentUser = users[i];
                sessionStorage.user = jsonStringify(currentUser);
                loggedin = true;
                sessionStorage.loggedin = jsonStringify(loggedin);
                $("#abouth1").text("Welcome! About Where's my Stuff?").css("color", "red");
                $("#myStuffh1").text("Welcome! Where's my Stuff?").css("color", "red");
                $("#profileh1").text("Welcome! Let's Get Started!").css("color", "red");
                $("#indexh1").text("Welcome! Where's my Stuff?").css("color", "red");
                $('#login-modal').modal('hide');
                //Notify user of success if on profile page - will provide modal option for other pages in future
                var currentPage = location.href.split("/").slice(-1);

                if (currentPage == "profile") {
                    document.getElementById("profileNotifications").innerHTML =
                    "<h3 class='show text-center' id='profileParaNotification'>You have now logged in!<br /> Click <a href='profile.html'>here</a> to view your profile information</h3>";
                }
                
                break;
            }
            else {
                //clear inputs and add message in red to retry
                document.getElementById("loginUserName").value = "";
                document.getElementById("loginPassword").value = "";
                currentUser = null;
                sessionStorage.user = jsonStringify(currentUser);
                loggedin = false;
                sessionStorage.loggedin = jsonStringify(loggedin);
                $(".modLogin-help").html("<p>Please check your log-in information or <a id='register' href='profile.html'>Register</a><p/>");
            }
        }
        
    }
    else {
        $(".modLogin-help").html("<p class='modRedColor'>Please check your log-in information or <a id='register' href='profile.html'>Register</a><p/>");
    }
}

//***CREATE

//Create user
function addUser() {
    //Clear any notifications
    document.getElementById("profileNotifications").innerHTML = "";

    //Grab values from the profile input boxes
    var fullname = $("#profileFullName").val();
    var username = document.getElementById("profileUsername").value;
    var password = document.getElementById("profilePassword").value;
    var phone = document.getElementById("profilePhone").value;
    var street = document.getElementById("profileStreet").value;
    var city = document.getElementById("profileCity").value;
    var state = document.getElementById("profileState").value;
    var zip = document.getElementById("profileZip").value;
    //Create a new User object
    var data = new User(fullname, username, password, phone, street, city, state, zip);
    //Push data into users array & sessionStorage.usersArray
    users.push(data);
    sessionStorage.user = jsonStringify(data);
    sessionStorage.usersArray = jsonStringify(users);
    //Clear form
    clearProfileForm();
    //Notify user of success!
    document.getElementById("profileNotifications").innerHTML =
        "<h3 class='show text-center' id='profileParaNotification'>Your profile has been created!<br /> Click <a href='#login-modal' data-toggle='modal'>here</a> to log in </h3>";
}

//Create item
function addItem() {
    document.getElementById("myStuffNotifications").innerHTML = "";
    //Check user is logged in
    var currentUser = ["user"];
    var currentUser = jsonParse('user');
    var loggedin = jsonParse('loggedin');

    if (currentUser != null && loggedin) {
        //Grab current username from sessionStorage.user
        var userName = currentUser.username;
        //See note above in user create for direct assignment to item properties
        //Grab values from the myStuff input boxes
        var itemName = $("#myStuffItemName").val();
        var itemDesc = document.getElementById("myStuffItemDesc").value;
        var locationSelect = document.getElementById("location");
        var itemLocation = locationSelect.options[locationSelect.selectedIndex].text;
        var itemLocationIndex = locationSelect.options[locationSelect.selectedIndex];
        var itemBox = document.getElementById("myStuffItemBox").value;
        var itemPhoto = document.getElementById("myStuffItemPhoto").value;

        //Create a new Item object; use the username from sessionStorage.user
        var item = new Item(userName, itemName, itemDesc, itemLocation, itemLocationIndex, itemBox, itemPhoto);
        //Push data into items array & sesionStorage.itemsArray
        items.push(item);
        sessionStorage.item = jsonStringify(item);
        sessionStorage.itemsArray = jsonStringify(items);
        clearItemForm();
        document.getElementById("myStuffNotifications").innerHTML =
        "<h3 class='show text-center' id='myStuffParaNotification'>Your item has been added!<br /> " +
        "Click <a onclick='displayItems()'>here</a> to display your current list of items </h3>";
    }
    else {
        var loginModal = document.getElementById("login-modal");
        //trigger modal display
        $('#login-modal').modal('toggle');
    }


}

//***RETRIEVE

//Read user
function displayProfile(username) {
    //Clear any notifications
    document.getElementById("profileNotifications").innerHTML = "";

    //Get the current sessionStorage.user on profile pageload & get the logged in value also
    var currentUser = jsonParse('user');
    loggedin = jsonParse('loggedin');

    if (currentUser != null && loggedin) {
        //populate the input boxes on profile
        document.getElementById("profileFullName").value = currentUser.fullName;
        document.getElementById("profileUsername").value = currentUser.username;
        document.getElementById("profilePassword").value = currentUser.password;
        document.getElementById("profilePhone").value = currentUser.phone;
        document.getElementById("profileStreet").value = currentUser.street;
        document.getElementById("profileCity").value = currentUser.city;
        document.getElementById("profileState").value = currentUser.state;
        document.getElementById("profileZip").value = currentUser.zip;
        //disable inputs (will enable when "edit" is clicked) 
        document.getElementById("profileFullName").disabled = true;
        document.getElementById("profileUsername").disabled = true;
        document.getElementById("profilePassword").disabled = true;
        document.getElementById("profilePhone").disabled = true;
        document.getElementById("profileStreet").disabled = true;
        document.getElementById("profileCity").disabled = true;
        document.getElementById("profileState").disabled = true;
        document.getElementById("profileZip").disabled = true;
        //Enable the edit, save and delete buttons
        document.getElementById("profileBtnEdit").className = "btn btn-info";
        document.getElementById("profileBtnSave").className = "btn btn-info";
        document.getElementById("profileBtnDelete").className = "btn btn-danger";
    }
    else {
        //Ensure all text boxes are set to ""
        //Leave all inputs enabled so users can create a profile if not logged in
        document.getElementById("profileFullName").value = "";
        document.getElementById("profileUsername").value = "";
        document.getElementById("profilePassword").value = "";
        document.getElementById("profilePhone").value = "";
        document.getElementById("profileStreet").value = "";
        document.getElementById("profileCity").value = "";
        document.getElementById("profileState").value = "";
        document.getElementById("profileZip").value = "";
    }

}

//Read items
function displayItems() {
    //Get the logged in status
    loggedin = jsonParse('loggedin');
    //Reset any prior notification on the page
    document.getElementById("myStuffNotifications").innerHTML = "";

    if (loggedin) {

        //Grab the currentuser
        var currentUser = jsonParse('user');
        //Grab the currentItems list
        var currentItems = jsonParse('itemsArray')
        //If logged in ....
        if (currentUser != null && currentItems != null) {
            //create display table header row
            var t = '';
            t += "<table class='table table-striped'>";
            t += "<tr><th>Select item</th><th>Item name</th><th>Description</th><th>Location</th><th>Box #</th><th></th><tr>";

            //Search objects for matching username in array
            for (var i = 0; i < currentItems.length; i++) {

                if (currentUser.username == currentItems[i].userName) {

                    //Build the table here.  Add a radio button and a hidden field for the index

                    for (var i = 0; i < currentItems.length; i++) {
                        t += "<tr>";
                        //added the "i" as the radio button's id
                        t += "<td><input type='radio' class = 'radioItems' name='rdoItem' id='" + i + "' onclick='displayItemPhoto(this)'/></td>";
                        t += "<td>" + currentItems[i].itemName + "</td>";
                        t += "<td>" + currentItems[i].itemDesc + "</td>";
                        t += "<td>" + currentItems[i].itemLocation + "</td>";
                        t += "<td>" + currentItems[i].itemBox + "</td>";
                        //Note that we're passing the index value here (i) as part of the onclick attribute.
                        t += "<td class='hidden' id='tableUsername'>" + currentItems[i].userName + "</td>"
                        t += "</tr>";
                    }

                    t += "</table>";
                    //document.getElementById("display").innerHTML = t;
                    $("#myStuffItemTable").html(t);
                    //enable the edit & delete buttons

                    //show the first item's photo
                    if (currentItems[0].itemPhoto != null) {
                        $("#myStuffItemImage").attr("src", currentItems[0].itemPhoto);
                    }

                }
                else {
                    document.getElementById("myStuffNotifications").innerHTML =
"<h3 class='show text-center' id='myStuffParaNotification'>No items to display!</h3>";
                }
            }
        }
    }
    else {
        //Else .... launch login modal
        $('#login-modal').modal('toggle');
    }

}

//Display photo of item selected in table
function displayItemPhoto(selectedRdo) {
    //display the selected item's photo (change event from the radio button)

    //    $(".radioitems").change(function () {

    //Grab the array index from the row (pass this into a hidden field when building the Item table)
    //how do I get the radiobutton id?
    var currentItemID = selectedRdo.id;
    var currentItems = jsonParse('itemsArray');
    var currentItemPhoto = "";
    //Check a photo exists first .... !
    for (var i = 0; i < currentItems.length; i++) {

        if (currentItemID == i) {
            //get currentItem       
            currentItemPhoto = currentItems[i].itemPhoto;
            $("#myStuffItemImage").attr("src", currentItemPhoto);
        }
        else {
            //Insert "oops" code here
        }
    }
    //    });

}

//**UPDATE

//Update user profile
function editProfile() {

    //enable all but the username for editing
    document.getElementById("profileFullName").disabled = false;
    document.getElementById("profilePassword").disabled = false;
    document.getElementById("profilePhone").disabled = false;
    document.getElementById("profileStreet").disabled = false;
    document.getElementById("profileCity").disabled = false;
    document.getElementById("profileState").disabled = false;
    document.getElementById("profileZip").disabled = false;

}

//Save user profile changes
function saveProfile() {
    //Clear any message
    document.getElementById("profileNotifications").innerHTML = "";

    //Grab the current values in the profile inputs
    var fullname = $("#profileFullName").val();
    var username = document.getElementById("profileUsername").value;
    var password = document.getElementById("profilePassword").value;
    var phone = document.getElementById("profilePhone").value;
    var street = document.getElementById("profileStreet").value;
    var city = document.getElementById("profileCity").value;
    var state = document.getElementById("profileState").value;
    var zip = document.getElementById("profileZip").value;

    //Create new User from edited User info
    //Change to direct assignment
    var editedUser = new User(fullname, username, password, phone, street, city, state, zip);
    //Update sessionStorage.user
    sessionStorage.user = JSON.stringify(editedUser);
    //get current editedUsers from sessionStorage.usersArray
    var editedUsers = jsonParse('usersArray');

    //Search objects for matching username in array
    for (var i = 0; i < editedUsers.length; i++) {

        if (editedUser.username == editedUsers[i].username) {
            //var editedUserIndex = i;
            //remove current user object at position i and replace with editedUser                
            editedUsers.splice(i, 1, editedUser);
            //Write updated array to sessionStorage
            sessionStorage.usersArray = JSON.stringify(editedUsers);
            //Display success message
            document.getElementById("profileNotifications").innerHTML =
    "<h3 class='show text-center' id='profileParaNotification'>Your profile has been updated!</h3>";

        }
        else {
            //Insert "oops" code here
        }
    }
}

//Update item
function editItem() {
    //Clear any notifications
    document.getElementById("myStuffNotifications").innerHTML = "";

    //Check for a selected radio button in the table
    var radioItems = document.getElementsByName('rdoItem');
    var selectedItemID;

    for (var i = 0; i < radioItems.length; i++) {
        if (radioItems[i].checked) {
            selectedItemID = i;
            break;
        }
    }
    //Grab the current values in the sessionStorageItemsArray
    var currentItems = jsonParse('itemsArray');

    //Search objects for matching item in array; populate input fields
    for (var i = 0; i < currentItems.length; i++) {
        if (selectedItemID == i) {
            $("#myStuffItemName").val(currentItems[i].itemName);
            $("#myStuffItemDesc").val(currentItems[i].itemDesc);
            $("#location").prop("selectedIndex", currentItems[i].itemLocationIndex);
            $("#myStuffItemBox").val(currentItems[i].itemBox);

            //cannot set this from sessionStorage due to built-in security (per research)
            //if not populated, will have to leave as the current setting
            //$("#myStuffItemPhoto").val(currentItems[i].itemPhoto);
        }
    }
}

//Save item changes
function saveItem() {
    //Clear any notifications
    document.getElementById("myStuffNotifications").innerHTML = "";

    //modify object properties for selected item
    //be sure to skip the itemPhoto property - populate with the existing one.

    //Grab the current values in the item inputs
    var itemName = $("#myStuffItemName").val();
    var itemDesc = $("#myStuffItemDesc").val();
    //get select
    var locationSelect = document.getElementById("location");
    //get text of selected option
    var itemLocation = locationSelect.options[locationSelect.selectedIndex].text;
    //get selected index of selected option
    var itemLocationIndex = document.getElementById("location").selectedIndex;
    var itemBox = $("#myStuffItemBox").val();


    //We also need to get the currently logged in userName
    //get current user from sessionStorage.usersArray
    var currentUser = jsonParse('user');
    //assign userName from current User
    var userName = currentUser.username;

    //get current item from sessionStorage.itemsArray
    var currentItem = jsonParse('itemsArray');
    // We need to get the current itemPhoto value if the user didn't upload a new one/reupload existing
    if (itemPhoto == "") {
        itemPhoto = currentItem.itemPhoto;
    }
    else {
        var itemPhoto = $("#myStuffItemPhoto").val();
    }

    //Lastly, get the original items array index from the radio ID
    var radioItems = document.getElementsByName('rdoItem');
    var selectedItemID;

    for (var i = 0; i < radioItems.length; i++) {
        if (radioItems[i].checked) {
            selectedItemID = i;
            break;
        }
    }

    //Create new Item from edited Item info
    //Change to direct assignment?
    var editedItem = new Item(userName, itemName, itemDesc, itemLocation, itemLocationIndex, itemBox, itemPhoto);
    //Update sessionStorage.item
    sessionStorage.item = jsonStringify(editedItem);
    //get current Items from sessionStorage.itemsArray
    var editedItems = jsonParse('itemsArray');
    var updated;

    //Search objects for matching username in items array
    for (var i = 0; i < editedItems.length; i++) {
        //have to check the items array for both the user name and the items array index
        if (editedItem.userName == editedItems[i].userName && selectedItemID == i) {

            //remove current item object at position i and replace with editedItem
            editedItems.splice(i, 1, editedItem);
            //Write updated array to sessionStorage
            sessionStorage.itemsArray = jsonStringify(editedItems);
            updated = true;
        }
        else {
            //Insert "oops" code here
        }
    }
    if (updated) {
        document.getElementById("myStuffNotifications").innerHTML =
"<h3 class='show text-center' id='myStuffParaNotification'>Your item has been updated! < /br>" +
        "Click <a onclick='displayItems()'>here</a> to display your updated list of items </h3>";
    }
}

//***DELETE

//Delete user
function deleteUser() {
    //Clear any notifications
    document.getElementById("profileNotifications").innerHTML = "";

    //get current user & assign to (soon-to-be) deletedUser
    var deletedUser = jsonParse('user');
    //get logged in status
    loggedin = jsonParse('loggedin');

    //Get current usersArray for iteration purposes
    var currentUsersArray = jsonParse('usersArray');
    //Temp array to hold remaining users
    var editedUserArray = [];

    //Get current itemsArray for iteration purposes
    var currentItemsArray = ["item"];
    currentItemsArray = jsonParse('itemsArray');
    //Temp array to hold remaining items
    var retainItemsArray = [];

    //Delete the user's items
    if (deletedUser != null && currentItemsArray != null && loggedin) {
        //reset session storage items array
        sessionStorage.setItem('itemsArray', "");

        //get correct user's items from items array
        for (var i = 0; i < currentItemsArray.length; i++) {
            if (deletedUser.username != currentItemsArray[i].userName) {
                //modify the retainItemsArray
                retainItemsArray.push(currentItemsArray[i]);
                //Update the sessionStorage.itemsArray for cross-page updates
                if (retainItemsArray.length > 0) {
                    sessionStorage.itemsArray = jsonStringify(retainItemsArray);
                }
                else {
                    sessionStorage.setItem('itemsArray', "");
                }                
            }
        }
        //Display success message
        document.getElementById("profileNotifications").innerHTML =
"<h3 class='show text-center' id='profileParaNotification'>Your profile has been deleted</h3>";
    }
    else {
        //Oops code
    }
    //Update the usersArray
    if (deletedUser != null && loggedin) {
        //reset session storage users array
        sessionStorage.setItem('usersArray', "");

        //get correct user from users array
        for (var i = 0; i < currentUsersArray.length; i++) {
            //Search objects for non-matching username in array & assign to updated array
            if (deletedUser.username != currentUsersArray[i].username) {
                //modify the editedUserArray
                editedUserArray.push(currentUsersArray[i]);
                //Update the sessionStorage.itemsArray for cross-page updates
                if (editedUserArray.length > 0) {
                    sessionStorage.usersArray = jsonStringify(editedUserArray);
                }
                else {
                    var defaultUser = new User("n", "u", "p", "p", "s", "c", "s", "z");
                    sessionStorage.usersArray = jsonStringify(defaultUser);
                }                
            }
            else {
                var defaultUser = new User("n", "u", "p", "p", "s", "c", "s", "z");
                sessionStorage.usersArray = jsonStringify(defaultUser);
            }
        }
        //clear out other sessionStorage items
        sessionStorage.userName = "";
        sessionStorage.password = "";
        sessionStorage.userIndex = "";
        sessionStorage.user = "";
    }
    else {
        //Oops code
    }


    //clear the profile form
    clearProfileForm();
}

//Delete items
function deleteItem() {
    //Clear any notifications
    document.getElementById("myStuffNotifications").innerHTML = "";

    //get current user & assign to (soon-to-be) deletedUser
    var deletedUser = jsonParse('user');
    //get current itemsArray & assign to (soon-to-be updated) deletedItemsArray
    var deletedItemsArray = jsonParse('itemsArray');
    loggedin = jsonParse('loggedin');

    //We need the index of the selected item in the table which will match the original index in the itemsArray
    var radioItems = document.getElementsByName('rdoItem');
    var selectedItemID;

    for (var i = 0; i < radioItems.length; i++) {
        if (radioItems[i].checked) {
            selectedItemID = i;
            break;
        }
    }
    //Delete the selected item

    if (deletedUser != null && loggedin) {
        var deleted;
        //get correct user's items from items array
        for (var i = 0; i < deletedItemsArray.length; i++) {
            //Search objects for matching username in array & remove matching item from items
            if (deletedUser.username === deletedItemsArray[i].userName && selectedItemID === i) {
                deletedItemsArray.splice(i, 1);
                sessionStorage.itemsArray = jsonStringify(deletedItemsArray);
                //Notify user
                document.getElementById("myStuffNotifications").innerHTML = "";
                deleted = true;
            }
        }
        if (deleted) {
            document.getElementById("myStuffNotifications").innerHTML =
"<h3 class='show text-center' id='myStuffParaNotification'>Your item has been deleted < /br>" +
        "Click <a onclick='displayItems()'>here</a> to display your updated list of items </h3>";
        }
    }
}

//***UTILITIES section

//Clear profile form
function clearProfileForm() {
    document.getElementById("profileFullName").value = "";
    document.getElementById("profileUsername").value = "";
    document.getElementById("profilePassword").value = "";
    document.getElementById("profilePhone").value = "";
    document.getElementById("profileStreet").value = "";
    document.getElementById("profileCity").value = "";
    document.getElementById("profileState").value = "";
    document.getElementById("profileZip").value = "";
}

//Clear item form
function clearItemForm() {

    $("#myStuffItemName").val("");
    document.getElementById("myStuffItemDesc").value = "";
    document.getElementById("location").selectedIndex = "-1";
    document.getElementById("myStuffItemBox").value = "";
    document.getElementById("myStuffItemPhoto").value = "";
}

//Function to handle JSON.stringify
function jsonStringify(sessionStorageObj) {
    return JSON.stringify(sessionStorageObj);

}

//Function to handle JSON.parse
function jsonParse(sessionStorageObj) {
    return JSON.parse(sessionStorage.getItem(sessionStorageObj));
}