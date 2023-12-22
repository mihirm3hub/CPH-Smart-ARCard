// adopted from https://github.com/supermedium/superframe/blob/master/components/look-at/dist/aframe-look-at-component.js
const { debug } = AFRAME.utils
const { coordinates } = AFRAME.utils

const warn = debug('components:look-at-test:warn')
const isCoordinates = coordinates.isCoordinates || coordinates.isCoordinate

const lookAtRotateComponent = {
    schema: {
        default: '0 0 0',

        parse(value) {
            // A static position to look at.
            if (isCoordinates(value) || typeof value === 'object') {
                return coordinates.parse(value)
            }
            // A selector to a target entity.
            return value
        },

        stringify(data) {
            if (typeof data === 'object') {
                return coordinates.stringify(data)
            }
            return data
        },
    },

    init() {
        this.target3D = null
        this.vector = new THREE.Vector3()
        this.cameraListener = AFRAME.utils.bind(this.cameraListener, this)
        this.modelMesh = this.el.getObject3D('mesh').getObjectByName('Head')
        // console.log(this.modelMesh)
        this.meshRot = this.modelMesh.rotation
        this.el.addEventListener('componentinitialized', this.cameraListener)
        this.el.addEventListener('componentremoved', this.cameraListener)
    },

    /**
     * If tracking an object, this will be called on every tick.
     * If looking at a position vector, this will only be called once (until further updates).
     */
    update() {
        const self = this
        const target = self.data
        let targetEl

        // No longer looking at anything (i.e., look-at="").
        if (
            !target ||
            (typeof target === 'object' && !Object.keys(target).length)
        ) {
            return self.remove()
        }

        // Look at a position.
        if (typeof target === 'object') {
            return this.lookAt(new THREE.Vector3(target.x, target.y, target.z))
        }

        // Assume target is a string.
        // Query for the element, grab its object3D, then register a behavior on the scene to
        // track the target on every tick.
        targetEl = self.el.sceneEl.querySelector(target)
        if (!targetEl) {
            warn(`"${target}" does not point to a valid entity to look-at`)
            return
        }
        if (!targetEl.hasLoaded) {
            return targetEl.addEventListener('loaded', () => {
                self.beginTracking(targetEl)
            })
        }
        return self.beginTracking(targetEl)
    },

    tick: (function () {
        const vec3 = new THREE.Vector3()

        return function (t) {
            // Track target object position. Depends on parent object keeping global transforms up
            // to state with updateMatrixWorld(). In practice, this is handled by the renderer.
            const { target3D } = this
            // console.log(this.meshRot)
            // console.log(this.meshRot, rotValue)
            if (target3D) {
                target3D.getWorldPosition(vec3)
                this.lookAt(vec3)
            }
        }
    }()),

    remove() {
        this.el.removeEventListener('componentinitialized', this.cameraListener)
        this.el.removeEventListener('componentremoved', this.cameraListener)
    },

    beginTracking(targetEl) {
        this.target3D = targetEl.object3D
    },

    cameraListener(e) {
        if (e.detail && e.detail.name === 'camera') {
            this.update()
        }
    },

    lookAt(position) {
        const { vector } = this

        // const {object3D} = this.modelMesh
        // console.log(this.modelMesh)
        if (this.el.getObject3D('camera')) {
            // Flip the vector to -z, looking away from target for camera entities. When using
            // lookat from THREE camera objects, this is applied for you, but since the camera is
            // nested into a Object3D, we need to apply this manually.
            vector
                .subVectors(this.modelMesh.position, position)
                .add(this.modelMesh.position)
        } else {
            vector.copy(position)
        }
        // console.log(vector)
        this.modelMesh.lookAt(vector)
    },
}
export { lookAtRotateComponent }

const minilookAtRotateComponent = {
    init() {
        this.vector = new THREE.Vector3()
        this.camera = document.getElementById('camera')
        this.threeCamera = this.camera.getObject3D('camera')
        //  this.el.addEventListener('model-loaded', () => {
        this.modelMesh = this.el.getObject3D('mesh').getObjectByName('Head')
        // this.modelMesh.rotation.x = -180
        console.log(this.modelMesh)
        //   })
    },
    tick() {
        const vec3 = new THREE.Vector3()
        // Raycast from camera to 'ground'
        // this.modelMesh.rotation.z = this.threeCamera.rotation.y
        this.threeCamera.getWorldPosition(vec3)
        // console.log(this.threeCamera.getWorldPosition(vec3))
        this.lookAt(vec3)
    },
    lookAt(position) {
        // console.log('position:', position)
        const { vector } = this
        const { object3D } = this.el

        if (this.threeCamera) {
            // Flip the vector to -z, looking away from target for camera entities. When using
            // lookat from THREE camera objects, this is applied for you, but since the camera is
            // nested into a Object3D, we need to apply this manually.
            vector.subVectors(object3D.position, position).add(object3D.position)
        } else {
            vector.copy(position)
        }

        if (this.modelMesh) {
            // console.log(-vector.x, -vector.y, -vector.z)
            this.modelMesh.lookAt(-vector.x, -vector.y, -vector.z)
            // this.modelMesh.rotation.x = 0
        }
    },
}
export { minilookAtRotateComponent }
