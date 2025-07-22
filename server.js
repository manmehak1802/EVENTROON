var express = require("express");
var fileuploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;
var mysql2 = require("mysql2");

var app = express();
app.use(fileuploader());
app.use(express.urlencoded(true));
app.listen(2007, function () {
  console.log("server started at port no:2007")
})
app.use(express.static("public"));
app.get("/", function (req, resp) {
  console.log(__dirname);
  console.log(__filename);

  let path = __dirname + "/PROJECT/index.html";
  resp.sendFile(path);
})
cloudinary.config({
  cloud_name: 'dnuo7jmkl',
  api_key: '722183415722574',
  api_secret: 'GQEEcOYed_aaH71Cin9UaI3L318' // Click 'View API Keys' above to copy your API secret
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAF9tPzbhNSe3R2bTRCNBYDRrNVWCVZ87k");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


let dbConfig = "mysql://avnadmin:AVNS_yS_QJ-mFP-Q0QMVo7SA@mysql-2ade5c60-manmehakkaur7-5035.c.aivencloud.com:19402/defaultdb?";
let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errKuch) {
  if (errKuch == null)
    console.log("AiVen Connected Successfulllyyy!!!!");
  else
    console.log(errKuch.message)
})

app.get("/get-one", function (req, resp) {
  // console.log(req.query);
  let emailid = req.query.txtEmail;
  let pwd = req.query.txtPwd;
  let combo = req.query.combo;

  mySqlVen.query("insert into projectdata values(?,?,?,current_date(),1)", [emailid, pwd, combo], function (errKuch) {
    if (errKuch == null)
      resp.send("Signup successful.....");
    else
      resp.send(errKuch.message);

  })
})

app.get("/login", function (req, resp) {

  let emailid = req.query.txtEmail2;
  let pwd = req.query.txtPwd2;

  let query = "SELECT * FROM projectdata WHERE emailid = ? AND pwd = ?";

  mySqlVen.query(query, [emailid, pwd], function (err, allRecords) {


    if (allRecords.length == 1) {
      let status = allRecords[0].status;

      if (status == 0)
        resp.send("Blocked");
      else if (status == 1)
        resp.send(allRecords[0].usertype);

    }
    else {
      resp.send("Invalid");
    }

  });
});


app.post("/send-to-server", async function (req, resp) {
  let picurl = "";
  if (req.files != null) {
    let fName = req.files.certificate.name;
    let fullPath = __dirname + "/public/uploades/" + fName;
    req.files.certificate.mv(fullPath);

    await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
      picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

      console.log(picurl);
    });
  }
  else
    picurl = "nopic.jpg";


  let emailid2 = req.body.emailid;
  let orgname = req.body.orgName;
  let regnumber = req.body.regNo;
  let address = req.body.addresss;
  let city = req.body.cityname;
  let sports = req.body.sportsname;
  let website = req.body.websitelink;
  let instagram = req.body.instagramlink;
  let head = req.body.headorg;
  let contact = req.body.Contact;
  let info = req.body.Info;

  mySqlVen.query("insert into orgdetails values(?,?,?,?,?,?,?,?,?,?,?,?)", [emailid2, orgname, regnumber, address, city, sports, website, instagram, head, contact, picurl, info], function (errKuch) {
    if (errKuch == null)
      resp.send("Record Saved Successfulllyyy....Badhai");
    else
      resp.send(errKuch)
  })
})

app.post("/update-users", async function (req, resp) {
  let picurl = "";
  if (req.files != null) {
    let fName = req.files.certificate.name;
    let fullPath = __dirname + "/public/uploades/" + fName;
    req.files.certificate.mv(fullPath);

    await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
      picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

      console.log(picurl);
    })
  }
  else
    picurl = req.body.hdn;


  let emailid2 = req.body.emailid;

  let address = req.body.addresss;
  let city = req.body.cityname;
  let sports = req.body.sportsname;
  let website = req.body.websitelink;
  let instagram = req.body.instagramlink;
  let head = req.body.headorg;
  let contact = req.body.Contact;
  let info = req.body.Info;

  mySqlVen.query("update orgdetails set address=?,city=?,sports=?,website=?,instagram=?,head=?,contact=?, picurl=?,info=? where emailid2=?", [address, city, sports, website, instagram, head, contact, picurl, info, emailid2], function (errKuch, result) {
    if (errKuch == null) {
      if (result.affectedRows == 1) {

        resp.send("record updated successfully.........!!!!!!!!!!")
      }
      else
        resp.send("invalid email id ");
    }
    else

      resp.send(err.message);


  })
})
app.get("/search", function (req, resp) {
  let emailid2 = req.query.emailid
  mySqlVen.query("select * from orgdetails where emailid2=?", [emailid2], function (err, allRecords) {


    if (allRecords.length == 0)
      resp.send("No Record Found");
    else
      resp.json(allRecords);
  })
})

app.get("/PUBLISH", function (req, resp) {
  // console.log(req.query);

  let emailid3 = req.query.Emailid;
  let eventname = req.query.event;
  let doe = req.query.eventdate;
  let toe = req.query.eventtime;
  let address = req.query.eventaddress;
  let city = req.query.eventcity;
  let sport = req.query.eventsport;
  let minage = req.query.Minage;
  let maxage = req.query.Maxage;
  let lastdate = req.query.eventlastdate;
  let fee = req.query.eventfee;
  let prize = req.query.prizemoney;
  let contact = req.query.person;
  mySqlVen.query("insert into eventdata values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid3, eventname, doe, toe, address, city, sport, minage, maxage, lastdate, fee, prize, contact], function (errKuch) {
    if (errKuch == null)
      resp.send(" event details uploaded successful.....");
    else
      resp.send(errKuch.message);

  })
})
// Fetch tournaments by email
app.get("/do-fetch-all-users", function (req, resp) {
  let emailid3 = req.query.emailid3;
  mySqlVen.query("SELECT * FROM eventdata WHERE emailid3=?", [emailid3], function (err, allRecords) {
    if (err == null) {
      resp.send(allRecords);
    } else {
      resp.send(err);
    }
  });
});

// Delete tournament by RID
app.get("/delete-one", function (req, resp) {
  let rid = req.query.ridKuch;
  mySqlVen.query("DELETE FROM eventdata WHERE rid=?", [rid], function (errKuch, result) {
    if (errKuch == null) {
      if (result.affectedRows === 1)
        resp.send("Record with RID " + rid + " deleted successfully!");
      else
        resp.send("Invalid RID");
    } else {
      resp.send(errKuch);
    }
  });
});
//--------------------------------------------------------------------------------------------------------------------------//
async function RajeshBansalKaChirag(imgurl) {
  try {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl).then((response) => response.arrayBuffer());

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(imageResp).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      myprompt,
    ]);

    const raw = result.response.text();
    console.log(" Gemini Raw OCR Output:\n", raw);

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);

    console.log(" Gemini JSON Output:\n", jsonData);
    return jsonData;
  } catch (err) {
    console.error(" OCR Parsing Error:", err);
    throw err;
  }
}

app.post("/send-data", async function (req, resp) {
  try {
    console.log("Received request to /send-data");

    let addharpic = "nopic.jpg";
    let profilepic = "nopic.jpg";

    // ========== Upload Aadhar Pic ==========
    if (req.files && req.files.pic1) {
      const fName = req.files.pic1.name;
      const fullPath = __dirname + "/public/uploades/" + fName;
      await req.files.pic1.mv(fullPath);
      console.log("Aadhar pic saved locally");

      const result = await cloudinary.uploader.upload(fullPath);
      addharpic = result.url;
      console.log("Aadhar pic uploaded to Cloudinary:", addharpic);
    }

    // ========== Upload Profile Pic ==========
    if (req.files && req.files.pic2) {
      const fName2 = req.files.pic2.name;
      const fullPath2 = __dirname + "/public/uploades/" + fName2;
      await req.files.pic2.mv(fullPath2);
      console.log("Profile pic saved locally");

      const result2 = await cloudinary.uploader.upload(fullPath2);
      profilepic = result2.url;
      console.log("Profile pic uploaded to Cloudinary:", profilepic);
    }

    // ========== OCR Extraction from Aadhar ==========
    const fName = req.files.pic1.name;
    const localPath = __dirname + "/public/uploades/" + fName;
    const cloudinaryResult = await cloudinary.uploader.upload(localPath);
    const jsonData = await RajeshBansalKaChirag(cloudinaryResult.url);

    console.log("OCR Result:", jsonData);

    const Emailid = req.body.email;
    const pname = jsonData.name;
    const dob = jsonData.dob;
    const gender = jsonData.gender;
    const address = req.body.Address;
    const contact = req.body.Contact;
    const game = req.body.games;
    const info = req.body.Info;

    const sql = "INSERT INTO playerdata VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [Emailid, addharpic, profilepic, pname, dob, gender, address, contact, game, info];

    mySqlVen.query(sql, values, function (errKuch) {
      if (errKuch == null) {
        console.log(" Data inserted into playerdata");   // changed to check specific error
        resp.send("Record Saved Successfully...Badhai");
      } else {
        console.error(" MySQL Insert Error:", errKuch);
        resp.status(500).send("Database Error: " + errKuch.message);  //changed to check specific error
      }
    });
  } catch (err) {
    console.error(" Caught Exception:", err);                     //changed to check specific error 
    resp.status(500).send("Server Error: " + err.message);
  }
});



app.get("/", function (req, resp) {

  // resp.sendFile();
  let dirName = __dirname;//Global Variable for path of current directory
  //let filename=__filename;
  //resp.send(dirName+"  <br>     "+filename);
  let fullpath = dirName + "/public/profile-players.html";
  resp.sendFile(fullpath);
})



//----------------------------------------------------------------------------------------------------------------------------//
app.post("/Modify-data", async function (req, resp) {
  let addharpic = "";
  let profilepic = "";

  try {
    if (req.files != null) {
      // Aadhaar Pic
      let fName = req.files.pic1.name;
      let fullPath = __dirname + "/public/uploades/" + fName;
      await req.files.pic1.mv(fullPath);
      let result1 = await cloudinary.uploader.upload(fullPath);
      addharpic = result1.url;
      console.log("Aadhaar pic:", addharpic);

      // Profile Pic
      let fName2 = req.files.pic2.name;
      let fullPath2 = __dirname + "/public/uploades/" + fName2;
      await req.files.pic2.mv(fullPath2);
      let result2 = await cloudinary.uploader.upload(fullPath2);
      profilepic = result2.url;
      console.log("Profile pic:", profilepic);
    } else {
      addharpic = "nopic.jpg";
      profilepic = "nopic.jpg";
    }

    let Emailid = req.body.email;
    let address = req.body.Address;
    let contact = req.body.Contact;
    let game = req.body.games;
    let info = req.body.Info;

    mySqlVen.query(
      "UPDATE playerdata SET addharpic=?, profilepic=?, address=?, contact=?, game=?, info=? WHERE Emailid=?",
      [addharpic, profilepic, address, contact, game, info, Emailid],
      function (errKuch) {
        if (errKuch == null) {
          resp.send("Update Saved Successfully... Badhai");
        } else {
          console.error(errKuch);
          resp.send(errKuch.message); // Only send message, not whole object
        }
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    resp.status(500).send("Something went wrong. Please try again.");
  }
});


//---------------------  
app.get("/find", function (req, resp) {
  let Emailid = req.query.emailid
  mySqlVen.query("select * from playerdata where Emailid=?", [Emailid], function (err, allRecords) {


    if (allRecords.length == 0)
      resp.send("No Record Found");
    else
      resp.json(allRecords);
  })
})
app.get("/fetch-all-data", function (req, resp) {

  mySqlVen.query("SELECT * FROM projectdata", [], function (err, allRecords) {

    resp.send(allRecords);

  });
});
app.get("/block-one", function (req, resp) {
  let emailid = req.query.emailid;

  mySqlVen.query("UPDATE projectdata SET status=0 WHERE emailid=?", [emailid], function (errKuch, result) {
    if (errKuch == null) {
      if (result.affectedRows === 1)
        resp.send("BLOCKED!!!! " + emailid);
      else
        resp.send("Invalid emailid");
    } else {
      resp.send(errKuch);
    }
  });
});
app.get("/unblock-one", function (req, resp) {
  let emailid = req.query.emailid;

  mySqlVen.query("UPDATE projectdata SET status=1 WHERE emailid=?", [emailid], function (errKuch, result) {
    if (errKuch == null) {
      if (result.affectedRows === 1)
        resp.send(" UNBLOCKED!!!!!!" + emailid);
      else
        resp.send("Invalid emailid");
    } else {
      resp.send(errKuch);
    }
  });
});
app.get("/do-fetch-all-tournaments", function (req, resp) {
  console.log(req.query)
  mySqlVen.query("select * from eventdata where city=? and sports=?", [req.query.kuchCity, req.query.kuchGame], function (err, allRecords) {
    console.log(allRecords)
    resp.send(allRecords);
  })
})

app.get("/do-fetch-all-cities", function (req, resp) {
  mySqlVen.query("select distinct city from eventdata", function (err, allRecords) {
    if (err) {
      console.log(err);
      resp.send( "Database error" );
    } else {
      resp.send(allRecords);
    }
  });
});
  
app.get("/do-fetch-all-sports", function (req, resp) {
  mySqlVen.query("select distinct sports from eventdata", function (err, allRecords) {
    if (err) {
      console.log(err);
      resp.send( "Database error" );
    } else {
      resp.send(allRecords);
    }
  });
});

app.get("/fetch-organizers", function (req, resp) {

  mySqlVen.query("SELECT * FROM orgdetails", [], function (err, allRecords) {

    resp.send(allRecords);

  });
});
app.get("/fetch-players", function (req, resp) {

  mySqlVen.query("SELECT * FROM playerdata", [], function (err, allRecords) {

    resp.send(allRecords);

  });
});
app.get("/do-change-password", function (req, res) {
  let newpwd = req.query.newpassword;
  let kuchemail = req.query.kuchemail;
  let kuchpwd = req.query.kuchpwd;

  console.log(req.query);

  mySqlVen.query("UPDATE projectdata SET pwd = ? WHERE emailid = ? AND pwd = ?", [newpwd, kuchemail, kuchpwd], function (err2, result2) {
    if (result2.affectedRows == 0) {
      res.send("Invalid email or old password!");
    } else {
      res.send("Password updated successfully!");
    }
  }
  );
});

