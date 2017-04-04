



// var dest = fs.createWriteStream('/Users/anish/Desktop/WORK/Spring_2017/Orgs/LavaLab/Peerval/downloaded.doc');
// drive.files.export({
//     fileId: fileId,
//      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
// }, function(err, result) {
//     //     console.log(result);
//     //     console.log(Object.prototype.toString.apply(result)); // Binary file content here
//     //
//     // fs.writeFile("/Users/anish/Desktop/WORK/Spring_2017/Orgs/LavaLab/Peerval/test.txt", result, function(err) {
//     //     if(err) {
//     //         return console.log(err);
//     //     }
//     //
//     //     console.log("The file was saved!");
//     // });
// })
//     .on('end', function() {
//         console.log('Done');
//     })
//     .on('error', function(err) {
//         console.log('Error during download', err);
//     })
//     .pipe(dest);

// var fs = require('fs');
// var obj = JSON.parse(fs.readFileSync('/Users/anish/Desktop/WORK/Spring_2017/Orgs/LavaLab/Peerval/downloaded.json', 'utf8'));
// console.log(obj);


// var http = require('http');
// var token ='ya29.GlwfBMwOqFhbfAq6Wgvas0-2R637yJCYxp-HSDCa-Ei9dk365sEqfhJk96FNGepS6cX68DZlhbXgQsDXzpx4wVWHV1Da3WgX9zNIz0rz5IQEhtzmwxJw66xbZz3V0g' ;
// var options = {
//     host: 'https://docs.google.com/',
//     path: 'document/u/1/export?format=docx&id=1OWM0cwieUcL6G34Lxv_-2jbPyCCsxOSI64OTIP7jE0k&token=ya29.GlwfBMwOqFhbfAq6Wgvas0-2R637yJCYxp-HSDCa-Ei9dk365sEqfhJk96FNGepS6cX68DZlhbXgQsDXzpx4wVWHV1Da3WgX9zNIz0rz5IQEhtzmwxJw66xbZz3V0g'
// };
//
// callback = function(response) {
//     var str = '';
//
//     //another chunk of data has been recieved, so append it to `str`
//     response.on('data', function (chunk) {
//         str += chunk;
//     });
//
//     //the whole response has been recieved, so we just print it out here
//     response.on('end', function () {
//         console.log(str);
//     });
// }
//
// http.request(options, callback).end();