const iconAnimComponent = {
    schema: {
        name: { type: 'string' },
        height: { type: 'number' },
        width: { type: 'number' },
    },
    init() {
        const { object3D } = this.el
        const scene = this.el.sceneEl
        const { name } = this.data

        const icons = document.querySelectorAll('.icon')
        const thumbs = document.querySelectorAll('.thumb')

        const vid = document.querySelector('#alphaVid')
        const v = document.querySelector('#alpha-video')

        let vidPlayed = false
        this.fade = 1000

        this.el.sceneEl.addEventListener('realityready', () => {
            vid.object3D.visible = true
        })

        // pre-play video as fix for black box bug (Android Only)
        v.muted = true
        v.play()
        v.pause()
        let videoSetup = false
        const restartVideo = () => {
            if (!videoSetup) {
                v.currentTime = 0
                videoSetup = true
            }
        }

        const setPosition = ({ detail }) => {
            if (name !== detail.name) {
                return
            }
            document.getElementById('front').object3D.visible = false
            document.getElementById('instIco').style.display = 'none'
            document.querySelectorAll('.clickable').forEach((ele) => {
                ele.classList.add('cantap')
            })
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            object3D.visible = true
        }

        const showImage = ({ detail }) => {
            console.log('exec')
            if (name !== detail.name) {
                return
            }
            if (!vidPlayed) {
                if (this.fade > 0) {
                    vid.setAttribute('material', 'opacity: 0')
                    vid.setAttribute('visible', 'true')
                    vid.setAttribute('animation', {
                        property: 'material.opacity',
                        from: 0,
                        to: 1,
                        easing: 'easeInOutQuad',
                        dur: this.fade,
                    })
                }
                v.play()
                vid.object3D.visible = true
                setTimeout(() => {
                    //  document.getElementById('pedro-model').setAttribute('visible', 'true')
                    document.getElementById('pedro-model').setAttribute('animation', 'property: model-relative-opacity.opacity;from: 0; to: 1; dur: 1200;')
                    //  document.getElementById('pedro-model').setAttribute('mini-look-at-rotate', '[camera]')
                }, 500)
                const handleVidEnd = () => {
                    console.log('checking time...')
                    if (v.currentTime > v.duration - 0.33) {
                        // 0.5 is seconds before end.
                        v.pause()
                        v.currentTime = 2.3
                        icons.forEach((ele) => {
                            ele.setAttribute('visible', 'true')
                            ele.setAttribute('mixin', 'iconProperties')
                        })
                        thumbs.forEach((ele) => {
                            ele.setAttribute('visible', 'true')
                            ele.setAttribute('mixin', 'thumbProperties')
                        })
                        scene.setAttribute('handle-ui', '')
                        v.removeEventListener('timeupdate', handleVidEnd)
                        vidPlayed = true
                    }
                }
                v.addEventListener('timeupdate', handleVidEnd)
                // setTimeout(() => {
                //   v.pause()
                //   document.getElementById('pedro-model').setAttribute('animation', 'property: model-relative-opacity.opacity;from: 0; to: 1; dur: 1200;')
                // }, 1910)
            }
            const container = document.getElementById('container')
            const handleClickEvent = (e) => {
                hideAll()
                container.classList.remove('collapsed')
            }
            document.getElementById('vid-thumb').addEventListener('click', handleClickEvent, true)
        }

        const foundTarget = (e) => {
            setPosition(e)
            setTimeout(() => {
                showImage(e)
            }, 300)
        }

        const lostTarget = () => {
            v.pause()
            //  object3D.visible = false
        }

        // this.el.parentNode.addEventListener('xrextrasimagegeometry', constructGeometry)
        this.el.parentNode.addEventListener('xrextrasfound', restartVideo)
        scene.addEventListener('xrimagefound', foundTarget)
        scene.addEventListener('xrimagelost', lostTarget)
    },
}
export { iconAnimComponent }
