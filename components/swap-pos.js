const haveIt = []

function generateUniqueRandom(min, max) {
    // Generate random number
    let random = min + Math.floor(Math.random() * (max - min + 1))

    // Coerce to number by boxing
    random = Number(random)

    if (!haveIt.includes(random)) {
        haveIt.push(random)
        return random
    } else if (haveIt.length < max) {
        // Recursively generate number
        return generateUniqueRandom(min, max)
    } else {
        console.log('No more numbers available.')
        return false
    }
}

const createEleGridComponent = {
    init() {
        console.log('grid created')
        for (let row = 0; row <= 3; row += 1.5) {
            for (let col = 0; col <= 3; col += 1.5) {
                //
                const cubes = document.createElement('a-box')
                cubes.setAttribute('class', 'cantap switchable-element numCube')
                cubes.setAttribute('width', '1.5')
                cubes.setAttribute('height', '1.5')
                cubes.setAttribute('depth', '1.5')
                cubes.setAttribute('scale', '.8 .8 .8')
                cubes.setAttribute('no-cull', '')
                cubes.setAttribute('shadow', '')
                cubes.setAttribute('position', {
                    x: 1.5 - col, y: 9 - row, z: -2,
                })
                setTimeout(() => {
                    const randomNum = generateUniqueRandom(1, 9)
                    cubes.id = `box_${randomNum}`
                    if (randomNum === 9) {
                        cubes.setAttribute('material', 'color: #FFCBB8; shader: flat; src: ')
                        cubes.insertAdjacentHTML('beforeend', `
          <a-entity id="${randomNum}" visible="false" material="opacity:0" text="value:${randomNum}; color:#0000ee; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/poppins/Poppins-Bold.json;" position="4.8 -0.3 0.76" scale="10 10 10"></a-entity>     
        `)
                    } else {
                        cubes.insertAdjacentHTML('beforeend', `
          <a-entity id="${randomNum}" material="opacity:0" text="value:${randomNum}; color:#0000ee; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/poppins/Poppins-Bold.json;" position="4.8 -0.3 0.76" scale="10 10 10"></a-entity>     
        `)
                        cubes.setAttribute('material', 'color: white; shader: flat; src: ')
                    }
                }, 10)

                this.el.appendChild(cubes)
            }
        }
        // setTimeout(() => {
        //   this.el.sceneEl.setAttribute('swap-pos', '')
        // }, 0)
    },
}
export { createEleGridComponent }

const swapPosComponent = {
    init() {
        let elPos1; let elPos2
        let element1; let element2
        const allElements = document.querySelectorAll('.switchable-element')
        const tmpPos = new THREE.Vector3()

        let boxes = []
        let box0; let box1; let box2; let box3; let box4; let box5; let box6; let box7; let box8; let box9
        setTimeout(() => {
            box1 = new THREE.Vector3(-1.5, 9, -2)
            box2 = new THREE.Vector3(0, 9, -2)
            box3 = new THREE.Vector3(1.5, 9, -2)
            box4 = new THREE.Vector3(-1.5, 7.5, -2)
            box5 = new THREE.Vector3(0, 7.5, -2)
            box6 = new THREE.Vector3(1.5, 7.5, -2)
            box7 = new THREE.Vector3(-1.5, 6, -2)
            box8 = new THREE.Vector3(0, 6, -2)
            box9 = new THREE.Vector3(1.5, 6, -2)
            boxes = [box0, box1, box2, box3, box4, box5, box6, box7, box8, box9]
            //  console.log('boxesArray:', boxes)
            checkPosExist()
        }, 100)

        const compareBox = new THREE.Vector3(1.5, 6, -2)
        const score = (scoreCount) => {
            const swapbox = document.getElementById('box_9').getAttribute('position')
            if (scoreCount >= 8 && swapbox.equals(compareBox) === true) {
                console.log('win')
                document.getElementById('winText').setAttribute('visible', 'true')
            }
        }

        let checkCounter = 0
        const checkPosExist = () => {
            for (let i = 1; i < 10; i++) {
                const ele = document.getElementById(`box_${i}`).getAttribute('position')
                // console.log(ele)

                if (ele.equals(boxes[i]) === true) {
                    checkCounter++
                    // console.log(checkCounter)
                }
            }
        }

        const checkPos = (passedEle) => {
            // console.log(checkCounter)
            const passedElePos = passedEle.getAttribute('position')

            if (passedEle.id === 'box_1' && passedElePos.equals(boxes[1]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_2' && passedElePos.equals(boxes[2]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_3' && passedElePos.equals(boxes[3]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_4' && passedElePos.equals(boxes[4]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_5' && passedElePos.equals(boxes[5]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_6' && passedElePos.equals(boxes[6]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_7' && passedElePos.equals(boxes[7]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_8' && passedElePos.equals(boxes[8]) === true) {
                checkCounter++
            } else if (passedEle.id === 'box_9' && passedElePos.equals(boxes[9]) === true) {
                checkCounter++
            }
            score(checkCounter)
        }

        allElements.forEach((el) => {
            const clickHandler = () => {
                // console.log('click')
                const activeElement = document.querySelector('.active')
                //  console.log(haveIt)
                if (!activeElement) {
                    element1 = el
                    console.log('1st log')
                    el.classList.add('active')
                    el.setAttribute('material', 'src: https://cdn.glitch.global/a9d7e03a-1f4f-4751-9ea0-b1ed9029613b/Selection_Blue_Solid.png')
                    elPos1 = el.getAttribute('position')
                } else if (el.id === 'box_9') {
                    element2 = el
                    console.log('2nd log')
                    el.classList.add('active')
                    elPos2 = el.getAttribute('position')
                    tmpPos.copy(elPos1)
                    // console.log(elPos1, elPos2)
                    element1.setAttribute('position', elPos2)
                    element2.setAttribute('position', tmpPos)

                    checkPos(element1)
                    // console.log(elPos1, elPos2)
                    document.querySelectorAll('.active').forEach((ele) => {
                        ele.classList.remove('active')
                        ele.setAttribute('material', 'src: ')
                    })
                } else {
                    document.querySelectorAll('.active').forEach((ele) => {
                        ele.classList.remove('active')
                        ele.setAttribute('material', 'src: ')
                    })
                }
            }
            el.addEventListener('click', clickHandler)
        })
    },
}
export { swapPosComponent }
