// universal validation function
module.exports.validate = (schema, values) => {
  return new Promise( (resolve, reject) => {
    for (field in schema) {
      if(schema[field].required) {
        if(!values[field]) {
          reject('Missing Required Field');
        }
      }
    }
    resolve(true);
  });
}


// img URL to base64 encoded string
module.exports.getBase64 = (http, url) => {
  return http.get(url, {responseType: 'arraybuffer'})
  .then(response => Buffer.from(response.data, 'binary').toString('base64'))
    .catch ((err) => { console.log(err)});
}