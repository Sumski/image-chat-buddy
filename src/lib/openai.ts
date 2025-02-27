
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
    // This is the Supabase anon key, which is public and safe to include in client-side code
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdGd0bHhsenN4Z29kZ3V2cGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Njg3NzUsImV4cCI6MjA1NjI0NDc3NX0.MMxSU4NMVGxVvbqcOr5l5hap4D8tWYkiLxHfK-KLBnY';
    
    const response = await fetch('https://matgtlxlzsxgodguvpan.supabase.co/functions/v1/chat-with-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
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
