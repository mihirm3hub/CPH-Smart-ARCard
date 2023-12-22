const cphLoadingScreenComponent = {
    init() {
        const scene = this.el.sceneEl
        const gradient = document.getElementById('gradient')
        const poweredby = document.getElementById('poweredby')
        const start = document.getElementById('start')

        setTimeout(() => {
            document.querySelector('.spinner').style.display = 'none'
            start.style.display = 'block'
        }, 3000)
        const dismissLoadScreen = () => {
            // setTimeout(() => {
            //   setTimeout(() => {
            poweredby.classList.add('fade-out')
            gradient.classList.add('fade-out')
            //    }, 1500)
            setTimeout(() => {
                poweredby.style.display = 'none'
                gradient.style.display = 'none'
            }, 1000)
            //   }, 3000)
        }
        start.addEventListener('click', () => {
            start.style.display = 'none'
            scene.hasLoaded ? dismissLoadScreen() : scene.addEventListener('loaded', dismissLoadScreen)
        })
    },
}
export { cphLoadingScreenComponent }
