//example form body:
// <form ref='uploadForm' action='http://localhost:3000/uploadURL' method='post' encType="multipart/form-data">
//     <input type="file" name="sampleFile" />
//     <input type='submit' value='Upload!' />
// </form>

//download the file from the submitted form
if (!req.files)
    return res.status(400).send('No files were uploaded.');

var filePath = '/Users/anish/Desktop/uploadedFile.docx';
req.files.sampleFile.mv(filePath, function(err) {
    if (err)
        return res.status(500).send(err);
    res.send('File uploaded!');
});
