"use strict";
const SingleFile = require("../models/singlefile");
const os = require("os");
const chilkat = require("@chilkat/ck-node14-win64");
const fs = require("fs");

const singleFileUpload = async (req, res, next) => {
  try {
    const file = new SingleFile({
      fileName: req.file.path.split("\\").pop(),
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size, // 0.00
    });
    await file.save();
    res.status(201).send("File Uploaded Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getallSingleFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getSingleFile = async (req, res, next) => {
  try {
    const file = await SingleFile.findOne();
    res.status(200).send(file);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/*const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};*/

const printfile = async (req, res, next) => {
  try {
    const file = await SingleFile.findOne();

    var ssh = new chilkat.Ssh();
    var sftp = new chilkat.SFtp();

    sftp.ConnectTimeoutMs = 5000;
    sftp.IdleTimeoutMs = 10000;
    ssh.ReadTimeoutMs = 1000;
    var port = 10022;

    // Deschide conexiunea SFTP si SSH din serverul NodeJS catre RaspberryPi
    var success = ssh.Connect("raspberry-pi-dinu.go.ro", port);
    if (success !== true) {
      console.log(ssh.LastErrorText);
      return;
    }
    var success = sftp.Connect("raspberry-pi-dinu.go.ro", port);
    if (success !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----ssh/sftp connected----");

    // Autentificarea SSH si SFTP catre RaspberryPi
    success = ssh.AuthenticatePw("ubuntu", "alex123");
    if (success !== true) {
      console.log(ssh.LastErrorText);
      return;
    }
    success = sftp.AuthenticatePw("ubuntu", "alex123");
    if (success !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----ssh/sftp autentificat----");

    // Initializare SFTP
    success = sftp.InitializeSftp();
    if (success !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----sftp initializat----");
    sftp.IdleTimeoutMs = 0;
    // Deschide un fisier pentru scriere
    // Daca aceesta deja exista, el va fi rescris
    var handle = sftp.OpenFile("stl/print.stl", "writeOnly", "createTruncate");
    if (sftp.LastMethodSuccess !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----fisier deschis----");
    // Uploadeaza fiserul din serveru de NodeJS in folderul /stl din RaspberryPi
    success = sftp.UploadFile(handle, "uploads/" + file.fileName);
    if (success !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----fisier incarcat----");
    sftp.IdleTimeoutMs = 10000;
    // Inchide fisierul
    success = sftp.CloseHandle(handle);
    if (success !== true) {
      console.log(sftp.LastErrorText);
      return;
    }
    console.log("----sftp inchis----");

    // Porneste sesiunea shell
    var channelNum = ssh.QuickShell();
    if (channelNum < 0) {
      console.log(ssh.LastErrorText);
      return;
    }
    console.log("----quick shell----");

    var sbCommands = new chilkat.StringBuilder();
    console.log("----1-----");
    //Transforma fisierul stl in gcode cu ajutorul CuraEngine si il trimite linie cu linie catre imprimanta 3d
    ssh.ReadTimeoutMs = 0;
    console.log("----2-----");
    sbCommands.Append(
      "CuraEngine slice -v -p -j /opt/curaengine/fdmprinter.def.json -o /home/ubuntu/gcode/print.gcode -l /home/ubuntu/stl/print.stl\n"
    );
    console.log("----3-----");
    success = ssh.ChannelSendString(
      channelNum,
      sbCommands.GetAsString(),
      "ansi"
    );
    sbCommands.Clear();
    success = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "Filament",
      "ansi",
      true
    ); //asteapta sa se finalizeze transformarea fisierului stl in gcode
    ssh.ReadTimeoutMs = 1000;
    console.log("--- output ----");
    console.log(ssh.GetReceivedText(channelNum, "ansi"));
    console.log("----gcode should be created----");
    sbCommands.Append("systemctl is-active print.service\n");
    success = ssh.ChannelSendString(
      channelNum,
      sbCommands.GetAsString(),
      "ansi"
    );
    sbCommands.Clear();
    var checkactive = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "\nactive",
      "ansi",
      false
    );
    var checkinactive = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "\ninactive",
      "ansi",
      false
    );
    var checkfailed = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "\nfailed",
      "ansi",
      false
    );
    console.log(checkactive + "activ");
    console.log(checkinactive + "inactiv");
    console.log(checkfailed + "failed");
    if (checkinactive === true) {
      sbCommands.Append("sudo systemctl start print.service\n");
    } else if (checkactive === true) {
      sbCommands.Append("echo Printer Bussy\n");
    } else if (checkfailed === true) {
      sbCommands.Append("echo Service Failed, Try to restart service\n");
      sbCommands.Append("sudo systemctl start print.service\n");
    } else {
      sbCommands.Append("echo ERROR Unknown \necho Check Logs\n\n");
    }
    success = ssh.ChannelSendString(
      channelNum,
      sbCommands.GetAsString(),
      "ansi"
    );
    sbCommands.Clear();
    console.log(ssh.GetReceivedText(channelNum, "ansi"));
    sbCommands.Append("systemctl is-active print.service\n");
    success = ssh.ChannelSendString(
      channelNum,
      sbCommands.GetAsString(),
      "ansi"
    );
    sbCommands.Clear();
    var checkactive = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "\nactive",
      "ansi",
      false
    );
    var checkfailed = ssh.ChannelReceiveUntilMatch(
      channelNum,
      "\nfailed",
      "ansi",
      false
    );
    if (checkactive === true) {
      sbCommands.Append("echo Print Started\n");
    } else if (checkfailed === true) {
      sbCommands.Append("echo Printer is DEAD\n");
    } else {
      sbCommands.Append("echo ERROR Unknown \nCheck Logs\n\n");
    }
    sbCommands.Append("exit\n");

    // Trimite toate comenzile SSH
    success = ssh.ChannelSendString(
      channelNum,
      sbCommands.GetAsString(),
      "ansi"
    );
    if (success !== true) {
      console.log(ssh.LastErrorText);
      return;
    }

    success = ssh.ChannelSendEof(channelNum);

    success = ssh.ChannelReceiveUntilMatch(channelNum, "logout", "ansi", true);

    success = ssh.ChannelSendClose(channelNum);

    success = ssh.ChannelReceiveToClose(channelNum);

    console.log(ssh.GetReceivedText(channelNum, "ansi"));
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletefile = async (req, res, next) => {
  try {
    const files = await SingleFile.findOne();
    let resultHandler = function (err) {
      if (err) {
        console.log("unlink failed", err);
      } else {
        console.log("file deleted");
      }
    };
    fs.unlink("uploads/" + files.fileName, resultHandler);
    const file = await SingleFile.findByIdAndDelete(files._id);
    if (!file) res.status(404).send("No item found");
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  singleFileUpload,
  getallSingleFiles,
  getSingleFile,
  printfile,
  deletefile,
};
