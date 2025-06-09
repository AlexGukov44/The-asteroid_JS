const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('game').appendChild( renderer.domElement );

// освещение 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// отрисовка зеленой платформы 

const playerGeometry = new THREE.BoxGeometry(1, 0.2, 1);       // (ширина, высота, глубина)
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // задаем цвет
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = -3;
scene.add(player);

let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') moveLeft = true;
    if (event.code === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') moveLeft = false;
    if (event.code === 'ArrowRight') moveRight = false;
});

// красные обьекты 

const obstacles = [];

function createObstacle() {
    const size = Math.random() * 0.5 + 0.2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(geometry, material);
    obstacle.position.x = (Math.random() - 0.5) * 10;
    obstacle.position.y = 5;
    obstacle.userData = { speed: Math.random() * 0.02 + 0.01 };
    scene.add(obstacle);
    obstacles.push(obstacle);
}

const obstacleInterval = setInterval(createObstacle, 1000);

// счет 

let score = 0;
const scoreElement = document.getElementById('score');

function animate() {
    requestAnimationFrame(animate);

    if (moveLeft) player.position.x -= 0.05;
    if (moveRight) player.position.x += 0.05;

    player.position.x = Math.max(-5, Math.min(5, player.position.x));

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.position.y -= obstacle.userData.speed;

        if (checkCollision(player, obstacle)) {
            endGame();
            return;
        }

        if (obstacle.position.y < -5) {
            scene.remove(obstacle);
            obstacles.splice(i, 1);
            score += 1;
            scoreElement.textContent = `счёт: ${score}`;
        }
    }

    function checkCollision(obj1, obj2) {
        const box1 = new THREE.Box3().setFromObject(obj1);
        const box2 = new THREE.Box3().setFromObject(obj2);
        return box1.intersectsBox(box2);
    }

    function endGame() {
        alert(`игра окончена! ваш счёт: ${score}`);
    }

    obstacles.forEach(obstacle => {
        obstacle.userData.speed += 0.00001;
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
