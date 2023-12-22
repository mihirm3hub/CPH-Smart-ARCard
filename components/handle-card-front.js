const handleCardFrontComponent = {
    schema: {
        name: { type: 'string' },
    },
    init() {
        const { object3D } = this.el
        const { name } = this.data
        object3D.visible = false
        const frontParent = document.getElementById('frontParent')
        const inst = document.getElementById('inst')
        const instIco = document.getElementById('instIco')

        let uiVisible = false

        const setPosition = ({ detail }) => {
            if (name !== detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            object3D.visible = true
        }

        const showImage = ({ detail }) => {
            if (name !== detail.name) {
                return
            }
            document.getElementById('instIco').style.display = 'block'
            document.getElementById('back').object3D.visible = false
            document.querySelectorAll('.clickable').forEach((ele) => {
                ele.classList.remove('cantap')
            })
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            object3D.visible = true

            if (!uiVisible) {
                inst.classList.add('visible')
                inst.classList.remove('hidden')
                inst.classList.add('fade-in')
                inst.classList.remove('fade-out')

                instIco.classList.add('fade-out')
                instIco.classList.remove('fade-in')
                uiVisible = true
            }

            setTimeout(() => {
                console.log('front detected')
                frontParent.setAttribute('create-box-grid', '')
                frontParent.setAttribute('swap-pos', '')
            }, 300)

            inst.addEventListener('click', () => {
                inst.classList.add('fade-out')
                inst.classList.remove('fade-in')

                instIco.classList.add('fade-in')
                instIco.classList.remove('fade-out')
                setTimeout(() => {
                    inst.classList.add('hidden')
                    inst.classList.remove('visible')
                    inst.style.opacity = '0'
                }, 500)
            })

            instIco.addEventListener('click', () => {
                inst.classList.add('visible')
                inst.classList.remove('hidden')
                inst.classList.add('fade-in')
                inst.classList.remove('fade-out')

                instIco.classList.add('fade-out')
                instIco.classList.remove('fade-in')
                uiVisible = true
            })
        }

        const imageFound = ({ detail }) => {
            if (name !== detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
        }
        const imageLost = (e) => {
            //  object3D.visible = false
            // uiVisible = false
        }
        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', imageFound)
        this.el.sceneEl.addEventListener('xrimagelost', imageLost)
    },
}
export { handleCardFrontComponent }
