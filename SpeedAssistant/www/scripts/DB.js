var Appdb;
function CallDatabase() {
    if (G_Ripple === true) {
        Appdb = openDatabase("Speed_Assistant", "0.1", "A Database of Order Tracking", 2 * 1024 * 1024);
    } else {
        Appdb = window.sqlitePlugin.openDatabase({ name: "Speed_Assistant" });
    }
    //create the cars table using SQL for the database using a transaction
    Appdb.transaction(function (t) {
        //t.executeSql("DROP TABLE IF EXISTS Favorite_Location");
        t.executeSql("CREATE TABLE `Favorite_Location` (`ID`INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,	`Location`	TEXT,	`Google_Name`	TEXT,	`Custom_Name`	TEXT, FavoriteTime TEXT,	`Date`	TEXT,	`IsActive`	INTEGER);");
    });
    //Insert Data in Favorite_Location
    Appdb.transaction(function (t) {
        // t.executeSql("INSERT INTO Favorite_Location (Location, Google_Name, Custom_Name,FavoriteTime, Date, IsActive) VALUES (?,?,?,?,?,?)", ["12.5214522,25.1544232", "Kanti Nagar", "Home","FavTime", "Date", 0]);
    });
}

//To Insert All Favirote Location of User
function InsertFavLocation(FavLocData) {
    //Insert Data in Favorite_Location
    Appdb.transaction(function (t) {
        t.executeSql("INSERT INTO Favorite_Location (Location, Google_Name, Custom_Name, FavoriteTime, Date, IsActive) VALUES (?,?,?,?,?,?)",
            [FavLocData.Location, FavLocData.Google_Name, FavLocData.Custom_Name, FavLocData.FavoriteTime, FavLocData.Date, FavLocData.IsActive]
    , function (tx, results) {
        alert("Row Inserted: " + results.insertId);
    },
    function (err) {
        alert("InsertFavLocation Error");
    }

   );
    });

}


//To Get OrderItems by OrderID
function GetFavLoc() {
    console.log("S GetFavLoc");

    $("#tblFavLoc").find("tr:gt(0)").remove();
    if (Appdb) {
        Appdb.transaction(function (t) {
            t.executeSql("select * from Favorite_Location", [], ShowFavLoc
                ,
                 function (err) {
                     alert(err.code);
                 }
                );
        });
    } else {
        alert("db not found, your browser does not support web sql! in GetFavLoc()");
    }
    console.log(" E GetFavLoc");
}
function ClearFavorite() {

    if (Appdb) {
        Appdb.transaction(function (t) {
            t.executeSql("delete from Favorite_Location", [], function () {
                alert("Deleted Successfully!!!");
                $("#tblFavLoc").find("tr:gt(0)").remove();
            }
                ,
                 function (err) {
                     alert(err.code);
                 }
                );
        });
    } else {
        alert("db not found, your browser does not support web sql! in GetFavLoc()");
    }
}

function ClearFavoriteByID(ID) {

    if (Appdb) {
        Appdb.transaction(function (t) {
            t.executeSql("delete from Favorite_Location where ID = ?", [ID], function () {
                $("#tblFavLoc").find("tr:gt(0)").remove();
                GetFavLoc();
            }
                ,
                 function (err) {
                     alert(err.code);
                 }
                );
        });
    } else {
        alert("db not found, your browser does not support web sql! in GetFavLoc()");
    }
}