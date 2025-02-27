
// Function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 data from the DataURL
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

// Function to send a chat request with an image to the Supabase Edge Function
export const sendChatWithImage = async (prompt: string, imageBase64: string | null) => {
  try {
    const response = await fetch('https://matgtlxlzsxgodguvpan.supabase.co/functions/v1/chat-with-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageBase64,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from AI');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in sendChatWithImage:', error);
    throw error;
  }
};
