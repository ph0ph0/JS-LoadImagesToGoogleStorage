
var fs = require('fs')
const { Storage } = require('@google-cloud/storage')

const projectId = '<projectID>'

// Creates a client
const storage = new Storage({
  projectId: projectId,
  keyFilename: 'auth.json'
})

// Reference the bucket
var bucket = storage.bucket('stckchck-d9618.appspot.com')

// (1) PASTE HERE: This reads the folder where the images are stored
const folderContainingImages = '<path to folder containing images>'

async function iterate (filePath, file, array) {
  await bucket.upload(filePath, (err, file) => {
    if (err) { return console.error(err) }
    let filename = file.metadata.name
    let publicUrl = `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${filename}?alt=media`
    // Actually only need the public URL
    // console.log(`${filename}, ${publicUrl}`)
    console.log(`"${publicUrl}",`)
    array.push(publicUrl)
  })
}

async function uploadImage () {
  async function fileReadWrite () {
    const storageURLsArray = []
    await fs.readdir(folderContainingImages, (err, files) => {
      if (err) {
        console.error(`Could not read the directory`, err)
      }
      files.forEach(function (file) {
        // let internalData = []
        var filePath = `${folderContainingImages}/` + file
        // Upload a local file to a new file to be created in the bucket
        iterate(filePath, file, storageURLsArray)
      })
    })
    return storageURLsArray
  }
  const data = await fileReadWrite()
  return data
}

uploadImage().then((value) => {
  // console.log(JSON.stringify(value, null, 2));
  fs.writeFile(
    // (2) Change save path
    '<output file location>',
    JSON.stringify(value, null, 2),
    (err) => err ? console.error('error data not written', err) : console.log('Data written!')
  )
})
