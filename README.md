# 🕵️ Spot the Difference - React Game

**Spot the Difference** is a fun and visually engaging React-based game where players must identify subtle differences between two similar images — before time runs out!  
Built to showcase frontend skills, animations, logic handling, and responsive design.

### 🔗 Live Demo:
👉 [Play Now on Vercel](https://spotnish.vercel.app)

---

## 🎮 Game Features

- ✅ Multi-level gameplay (8 different themed image sets)
- ✅ Real-time click detection with difference matching
- ✅ Countdown timer + alert on timeout
- ✅ Sound effects on correct spot (ding) and time up
- ✅ Red highlight animation for found differences
- ✅ Automatic level progression and feedback
- ✅ Responsive UI for desktop & mobile

---

## 🖼️ Levels Included

- Ladybugs 🐞  
- Forest Animals 🌲  
- Fruits 🍎  
- Cycling 🚴  
- Concert Fun 🎶  
- Fashion Designer 👗  
- Jungle Tribes 🦉  
- Artist Painting 🎨  

---

## ⚙️ Built With

- **React JS** + React Router  
- Pure CSS animations & transitions  
- Dynamic image rendering  
- JSON-based game config per level  
- Vercel for deployment

---

## 🚀 Getting Started Locally

```
git clone https://github.com/NishanthGowda007/spot-the-difference.git
cd spot-the-difference
npm install
npm start
```


## 📁 Folder Structure
```
├── public/
│   ├── ding.mp3
│   ├── timeup.mp3
├── src/
│   ├── assets/       // All game images
│   ├── components/   // GameScreen, LevelSelector, HomeScreen
│   ├── data/         // JSON files for each level
```
## 🧩 Add New Levels

Each game level is controlled by a separate JSON file inside `src/data/`.

### Example JSON Format

```
{
  "gameTitle": "Spot the Difference - Forest",
  "images": {
    "image1": "forest1.jpg",
    "image2": "forest2.jpg"
  },
  "differences": [
    { "x": 120, "y": 180, "width": 40, "height": 40 },
    { "x": 300, "y": 150, "width": 35, "height": 35 }
  ]
}
```
To add a new level:

Place the two images in public/assets/

Create a new JSON file in src/data/

Update LevelSelector component to include the new level title + path


## 🙌 Creator  
👨‍💻 **Nishanth Gowda**  
[GitHub](https://github.com/NishanthGowda007) • [LinkedIn](https://www.linkedin.com/in/nishanth-gowda007)

