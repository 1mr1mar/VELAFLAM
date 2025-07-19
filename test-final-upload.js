// Final test to verify file upload with existing Supabase Storage
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

async function testFinalUpload() {
  try {
    console.log('Testing file upload with existing Supabase Storage...')
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.txt')
    const testContent = 'This is a test image file for upload testing'
    fs.writeFileSync(testImagePath, testContent)
    
    console.log('✅ Created test file:', testImagePath)
    
    // Test the upload API endpoint
    const formData = new FormData()
    const fileStream = fs.createReadStream(testImagePath)
    formData.append('file', fileStream, {
      filename: 'test-image.txt',
      contentType: 'text/plain'
    })
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    })
    
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Upload successful!')
      console.log('Response data:', JSON.stringify(data, null, 2))
      
      // Test if the file URL is accessible
      if (data.filePath) {
        console.log('Testing file URL accessibility...')
        const urlResponse = await fetch(data.filePath)
        console.log('File URL status:', urlResponse.status)
        if (urlResponse.ok) {
          console.log('✅ File URL is accessible!')
        } else {
          console.log('⚠️ File URL not accessible yet (may need time to propagate)')
        }
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ Upload failed')
      console.log('Error data:', JSON.stringify(errorData, null, 2))
    }
    
    // Clean up test file
    fs.unlinkSync(testImagePath)
    console.log('✅ Cleaned up test file')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testFinalUpload() 