import { getDatabaseInstance } from "./db";

const db = getDatabaseInstance();

db.run(
  `CREATE TABLE IF NOT EXISTS prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario TEXT,
  prompt TEXT
)`,
  function () {
    db.run(
      `INSERT INTO prompts(scenario, prompt) VALUES ("Outdoor Adventures", "Capture influencer_name as they hike through a vibrant forest, surrounded by towering trees and dappled sunlight."),
("Outdoor Adventures", "Pose influencer_name on a rocky ledge overlooking a breathtaking mountain range, with a sense of awe and adventure."),
("Fashion and Style", "Capture influencer_name in a chic urban setting, strutting confidently in a fashionable outfit that perfectly matches the bustling cityscape."),
("Fashion and Style", "Photograph influencer_name in a trendy fashion district, surrounded by vibrant storefronts and colorful street art, showcasing their impeccable style."),
("Wellness and Fitness", "Snap a photo of influencer_name striking a serene yoga pose on a pristine beach, with gentle waves and a stunning sunset as the backdrop."),
("Wellness and Fitness", "Capture influencer_name mid-workout in a state-of-the-art fitness studio, surrounded by motivational quotes and the energizing hum of exercise equipment."),
("Food and Culinary", "Take a mouthwatering shot of influencer_name expertly arranging a beautifully plated dish in a sunlit kitchen, highlighting the vibrant colors and textures."),
("Food and Culinary", "Photograph influencer_name savoring a delicious meal at a trendy restaurant, with artfully presented dishes and an atmosphere that exudes culinary excellence."),
("Travel and Exploration", "Capture influencer_name on a charming cobblestone street in a quaint European town, with colorful facades and bustling cafes as the backdrop."),
("Travel and Exploration", "Photograph influencer_name on a remote tropical island, standing on powdery white sand, surrounded by crystal-clear turquoise waters and swaying palm trees."),
("Beauty and Makeup", "Capture influencer_name in a softly lit vanity area, surrounded by a collection of high-end beauty products, meticulously applying a flawless makeup look."),
("Beauty and Makeup", "Photograph influencer_name collaborating with a renowned makeup artist, showcasing an avant-garde and visually stunning makeup creation."),
("Lifestyle and Home", "Snap a cozy shot of influencer_name in their stylish living room, curled up on a plush sofa, surrounded by warm lighting, and enjoying a good book."),
("Lifestyle and Home", "Capture influencer_name in their sleek and organized home office, sitting at a sleek desk with modern decor and large windows offering scenic views."),
("Inspirational and Motivational", "Photograph influencer_name standing on a mountaintop, arms outstretched, embracing the breathtaking vista before them, symbolizing empowerment and inspiration."),
("Inspirational and Motivational", "Capture influencer_name mid-workout, displaying their strength and determination, inspiring their followers to push their limits and achieve their fitness goals."),
("Outdoor Adventures", "Capture influencer_name kayaking through a serene lake, surrounded by lush greenery and towering mountains in the distance."),
("Outdoor Adventures", "Pose influencer_name on a picturesque cliff, overlooking a vast and tranquil ocean, with crashing waves and a gentle breeze in the air."),
("Fashion and Style", "Photograph influencer_name strolling through a vibrant flower market, donning a flowy summer dress and carrying a basket of colorful blooms."),
("Fashion and Style", "Showcase influencer_name's impeccable style as they walk down a bustling city street, surrounded by towering skyscrapers and stylish urbanites."),
("Wellness and Fitness", "Capture influencer_name meditating on a serene mountaintop, with panoramic views and a clear blue sky as the backdrop."),
("Wellness and Fitness", "Photograph influencer_name in a zen yoga retreat, surrounded by lush greenery and practicing invigorating poses in perfect harmony with nature."),
("Food and Culinary", "Snap a photo of influencer_name exploring a vibrant farmers market, carefully selecting fresh produce and engaging with friendly vendors."),
("Food and Culinary", "Capture influencer_name in a cozy kitchen, joyfully baking a batch of homemade cookies, with the aroma of sweet treats filling the air."),
("Travel and Exploration", "Photograph influencer_name wandering through the narrow streets of an ancient, charming village, capturing the essence of history and culture."),
("Travel and Exploration", "Capture influencer_name exploring a hidden waterfall in a tropical rainforest, with lush foliage and cascading water creating a magical backdrop."),
("Beauty and Makeup", "Capture influencer_name getting ready for a glamorous evening, sitting at a glamorous vanity table, surrounded by elegant cosmetics and mirrors."),
("Beauty and Makeup", "Photograph influencer_name attending a high-profile fashion event, dressed in a stunning gown, with professional makeup artists adding the finishing touches."),
("Lifestyle and Home", "Snap a cozy shot of influencer_name in a sunlit garden, surrounded by blooming flowers and enjoying a peaceful moment with a cup of tea."),
("Lifestyle and Home", "Photograph influencer_name in a minimalist bedroom, with soft neutral tones, clean lines, and plush bedding, creating a calming and serene atmosphere."),
("Inspirational and Motivational", "Capture influencer_name on a sandy beach, writing inspiring messages in the sand with the crashing waves as a backdrop, encouraging others to embrace positivity and self-love."),
("Inspirational and Motivational", "Photograph influencer_name engaging in a philanthropic activity, such as volunteering at a local charity, making a difference in the lives of those in need and inspiring followers to do the same."),
("Outdoor Adventures", "Capture influencer_name standing on a majestic mountaintop, with panoramic views of snow-capped peaks and a clear blue sky above."),
("Outdoor Adventures", "Pose influencer_name on a sandy beach at golden hour, with gentle waves rolling in and a vibrant sunset painting the sky in stunning hues."),
("Fashion and Style", "Photograph influencer_name attending a glamorous red carpet event, dressed in an exquisite designer gown, with flashing cameras capturing their every move."),
("Fashion and Style", "Showcase influencer_name's street style in a trendy neighborhood, posing against colorful graffiti walls and urban backdrops that reflect their unique fashion sense."),
("Wellness and Fitness", "Snap a photo of influencer_name in a serene meditation garden, surrounded by lush greenery and engaging in a peaceful mindfulness practice."),
("Wellness and Fitness", "Capture influencer_name in a challenging yoga pose on a mountaintop, demonstrating strength, flexibility, and the connection between mind and body."),
("Food and Culinary", "Take an overhead shot of influencer_name's beautifully arranged charcuterie board, showcasing an array of delectable cheeses, cured meats, and colorful fruits."),
("Food and Culinary", "Photograph influencer_name sipping a perfectly crafted latte in a cozy cafe, with latte art and the aroma of freshly brewed coffee creating an inviting atmosphere."),
("Travel and Exploration", "Capture influencer_name exploring a vibrant local market, immersed in the sights, sounds, and vibrant colors of exotic fruits, spices, and handmade crafts."),
("Travel and Exploration", "Photograph influencer_name in front of an ancient temple, dressed in traditional attire, experiencing and respecting the local culture during their travels."),
("Beauty and Makeup", "Capture influencer_name showcasing a bold and artistic makeup look, featuring vibrant colors, intricate designs, and avant-garde creativity."),
("Beauty and Makeup", "Photograph influencer_name trying out a new skincare routine, showcasing their radiant and glowing complexion, with a focus on natural beauty and self-care."),
("Lifestyle and Home", "Snap a cozy shot of influencer_name wrapped in a soft blanket, sitting by a crackling fireplace, surrounded by warm candles and a cup of hot cocoa."),
("Lifestyle and Home", "Photograph influencer_name hosting a stylish dinner party, with an elegantly set table, flickering candlelight, and delicious food that reflects their refined taste."),
("Inspirational and Motivational", "Capture influencer_name standing on a vast open field, arms outstretched, embracing the beauty of nature and encouraging followers to find inspiration in the world around them."),
("Inspirational and Motivational", "Photograph influencer_name participating in a charitable event, such as a marathon or fundraising campaign, motivating others to make a positive impact and support meaningful causes."),
("Outdoor Adventures", "Capture influencer_name exploring a hidden waterfall in a lush rainforest, surrounded by moss-covered rocks and a symphony of cascading water."),
("Outdoor Adventures", "Pose influencer_name on a serene lakeside dock at sunset, with vibrant hues painting the sky and reflecting in the calm waters."),
("Fashion and Style", "Photograph influencer_name in a vintage-inspired ensemble, walking through a charming, cobblestone-lined street, evoking nostalgia and timeless elegance."),
("Fashion and Style", "Showcase influencer_name's casual street style in a lively urban market, with vibrant street art, bustling crowds, and an array of trendy food stalls as the backdrop."),
("Wellness and Fitness", "Snap a photo of influencer_name in a serene garden, practicing gentle yoga poses, surrounded by blooming flowers and a sense of tranquility."),
("Wellness and Fitness", "Capture influencer_name during a sunrise jog along a picturesque coastal path, with the rhythmic sound of crashing waves and a breathtaking horizon ahead."),
("Food and Culinary", "Take a close-up shot of influencer_name's homemade artisanal bread, capturing its golden crust, airy texture, and inviting aroma."),
("Food and Culinary", "Photograph influencer_name in a bustling food market, holding a plate of exotic street food, capturing the vibrant colors and enticing aromas of international cuisine."),
("Travel and Exploration", "Capture influencer_name standing on a cliffside, overlooking a dramatic fjord, with misty mountains and cascading waterfalls in the distance."),
("Travel and Exploration", "Photograph influencer_name immersed in the cultural heritage of an ancient city, exploring narrow alleys, ornate architecture, and vibrant local markets."),
("Beauty and Makeup", "Capture influencer_name showcasing a glamorous evening makeup look, with sparkling eyeshadow, winged eyeliner, and bold red lips that exude confidence and sophistication."),
("Beauty and Makeup", "Photograph influencer_name in a serene spa environment, indulging in a luxurious skincare routine, with soothing products, soft lighting, and a backdrop of lush greenery."),
("Lifestyle and Home", "Snap a cozy shot of influencer_name curled up in a hammock, surrounded by towering palm trees, on a tropical paradise island."),
("Lifestyle and Home", "Photograph influencer_name in a beautifully styled workspace, with a clean, minimalist design, natural light streaming in, and inspirational quotes adorning the walls."),
("Inspirational and Motivational", "Capture influencer_name practicing mindfulness in a peaceful garden, meditating among blooming flowers and connecting with the present moment."),
("Inspirational and Motivational", "Photograph influencer_name participating in a volunteer project, lending a helping hand and making a positive impact in the local community."),
("Outdoor Adventures", "Capture influencer_name horseback riding through a vast, open field, with the wind in their hair and a sense of freedom in their expression."),
("Outdoor Adventures", "Pose influencer_name on the edge of a towering cliff, overlooking a rugged coastline, with crashing waves and seagulls soaring overhead."),
("Fashion and Style", "Photograph influencer_name in a glamorous black-tie attire, attending a high-profile fashion event, with sparkling lights and a backdrop of fashion industry icons."),
("Fashion and Style", "Showcase influencer_name's casual chic style in a vibrant urban park, strolling along tree-lined paths and interacting with adorable puppies in a playful photo shoot."),
("Wellness and Fitness", "Snap a photo of influencer_name practicing sunrise meditation on a serene beach"),
("Front-facing pose", "Capture a front-facing shot of influencer_name, standing tall with their arms relaxed by their sides, looking directly at the camera."),
("Side profile pose", "Photograph influencer_name in a side profile pose, turning their head to the side while maintaining a straight posture, showcasing the contours of their face and silhouette."),
("45-degree angle pose", "Capture influencer_name at a 45-degree angle, with one shoulder closer to the camera and the other slightly turned away, allowing for a three-dimensional perspective."),
("Over-the-shoulder pose", "Photograph influencer_name looking back over their shoulder towards the camera, capturing their profile and the back of their head, providing a unique angle for reconstruction."),
("Sitting pose", "Capture influencer_name sitting on a stool or chair, with their legs crossed or dangling, allowing for a different perspective and capturing the upper body from a seated position."),
("Kneeling pose", "Photograph influencer_name kneeling on the ground, providing a lower angle and capturing the upper body and face in a distinct pose."),
("Arms raised pose", "Capture influencer_name raising their arms above their head or holding them out to the sides, creating interesting shapes and capturing the full body in an extended pose."),
("Walking pose", "Photograph influencer_name walking towards or away from the camera, capturing them in motion and providing a range of angles for reconstruction."),
("Jumping pose", "Capture influencer_name jumping in the air, freezing the moment in a dynamic pose that captures different angles and perspectives for 3D reconstruction."),
("Close-up pose", "Photograph influencer_name up close, filling the frame with their face and upper body, allowing for detailed facial reconstruction and capturing fine details."),
("Neutral expression", "Capture influencer_name with a neutral expression, relaxed and natural, showcasing their baseline features for accurate 3D reconstruction."),
("Smile", "Photograph influencer_name with a warm and genuine smile, showcasing their teeth and facial muscles in a joyful expression."),
("Laughter", "Capture influencer_name in the midst of laughter, showcasing their happiness and capturing the dynamic movement of their facial muscles."),
("Surprise", "Photograph influencer_name with a surprised expression, capturing their wide-open eyes and raised eyebrows, showcasing the element of surprise."),
("Anger", "Capture influencer_name with a slightly furrowed brow, narrowed eyes, and a hint of tension in their facial muscles, conveying a sense of controlled anger."),
("Sadness", "Photograph influencer_name with a subtle downward curve of the lips, slightly drooping eyes, and a reflective expression, conveying a sense of melancholy."),
("Excitement", "Capture influencer_name with wide eyes, an open mouth, and raised eyebrows, capturing their vibrant and enthusiastic expression."),
("Pensive", "Photograph influencer_name with a thoughtful expression, slightly raised eyebrows, and a gaze directed inwards, conveying deep contemplation."),
("Surprise", "Capture influencer_name with widened eyes, raised eyebrows, and an open mouth, capturing their genuine surprise and astonishment."),
("Disgust", "Photograph influencer_name with a wrinkled nose, narrowed eyes, and a slight curl of the upper lip, conveying a sense of distaste or aversion."),
("Fear", "Capture influencer_name with widened eyes, raised eyebrows, and a slightly open mouth, capturing their expression of fear or apprehension."),
("Confusion", "Photograph influencer_name with a slightly furrowed brow, raised eyebrows, and a questioning expression, conveying a sense of confusion or uncertainty."),
("Delight", "Capture influencer_name with bright eyes, a wide smile, and a radiant expression of pure delight, capturing their contagious happiness."),
("Contentment", "Photograph influencer_name with a serene expression, relaxed features, and a gentle smile, conveying a sense of inner peace and satisfaction."),
("Serious", "Capture influencer_name with a composed expression, firm lips, and focused eyes, conveying a sense of seriousness and determination."),
("Surprise", "Photograph influencer_name with widened eyes, dropped jaw, and raised eyebrows, capturing their genuine and unexpected surprise."),
("Natural sunlight", "Capture influencer_name in soft, natural sunlight, streaming through a window or outdoors, creating a warm and flattering glow on their face."),
("Golden hour", "Photograph influencer_name during the golden hour, with the warm, golden light of the setting sun casting a soft and enchanting glow on their features."),
("Backlit silhouette", "Capture influencer_name as a striking silhouette against a bright background or with light coming from behind, creating a dramatic and artistic effect."),
("Candlelight", "Photograph influencer_name in the intimate glow of candlelight, with flickering flames casting gentle shadows and creating a cozy and romantic atmosphere."),
("Studio lighting", "Capture influencer_name in a professional studio setup with carefully controlled lighting, highlighting their features with precise and even illumination."),
("Neon lights", "Photograph influencer_name surrounded by vibrant neon lights, capturing the colorful and electric ambiance, adding a modern and urban feel to the composition."),
("Softbox lighting", "Capture influencer_name in a controlled indoor setting with softbox lighting, providing diffused and evenly distributed light for a flattering and balanced look."),
("Nighttime ambiance", "Photograph influencer_name in a dimly lit environment, using ambient lighting to create a moody and atmospheric atmosphere, emphasizing shadows and contrast."),
("Sunrise or sunset", "Capture influencer_name during a captivating sunrise or sunset, with the warm, rich hues of the sky casting a breathtaking and ethereal light on their face."),
("Firelight", "Photograph influencer_name near a crackling fireplace or bonfire, capturing the warm and dynamic light of the flames dancing on their features."),
("City streetlights", "Capture influencer_name under the glow of city streetlights at night, with the urban landscape and the soft glow of artificial light adding an urban and cinematic touch."),
("Spotlight", "Photograph influencer_name illuminated by a single spotlight, creating a dramatic and focused lighting effect that emphasizes their presence and features."),
("Window light", "Capture influencer_name near a large window with soft, diffused natural light pouring in, creating a soft and flattering illumination on their face."),
("Outdoor shadows", "Photograph influencer_name in an outdoor setting with interesting shadow patterns, capturing the interplay of light and shadow for a dynamic composition."),
("Underwater lighting", "Capture influencer_name underwater with specialized lighting equipment, creating a mesmerizing and ethereal effect with the play of light and water.")`,
      function (err) {
        if (err) return console.log(err);
        console.log("done");
      }
    );
  }
);
