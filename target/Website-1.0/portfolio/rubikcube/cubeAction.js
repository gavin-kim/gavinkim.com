/**
 *  U: UP    (Green)  - faceId : 8 ~ 9
 *  D: DOWN  (Orange) - faceId : 10 ~ 11
 *  L: LEFT  (White)  - faceId : 6 ~ 7
 *  R: RIGHT (Red)    - faceId : 4 ~ 5
 *  F: FRONT (Blue)   - faceId : 2 ~ 3
 *  B: BACK  (Yellow) - faceId : 0 ~ 1
 *
 *              ------UP-----
 *              |B,L|B,C|B,R|
 *              |C,L|C,C|C,R|
 *              |F,L|F,C|F,R|
 * -----LEFT--------FRONT--------RIGHT--------BACK-----
 * |U,B|U,C|U,F||U,L|U,C|U,R||U,F|U,C|U,B||U,R|U,C|U,L|
 * |C,B|C,C|C,F||C,L|C,C|C,R||C,F|C,C|C,B||C,R|C,C|C,L|
 * |D,B|D,C|D,F||D,L|D,C|D,R||D,F|D,C|D,B||D,R|D,C|D,L|
 * ------------------DOWN------------------------------
 *              |F,L|F,C|F,R|
 *              |C,L|C,C|C,R|
 *              |B,L|B,C|B,R|
 *              -------------
 *
 *  Each face indicates axisY, axisX.
 *  when you click the some face on the cube. (e.g axisY-> B,R <- axisX)
 */

function CubeAction(cube)
{
    this.cubeMap = new CubeMap(cube);

    this.testCube = function (targetNode, faceId)
    {
        var faceClicked = this.cubeMap.findFace(targetNode, faceId);
        var children = faceClicked.axisX.targetSide.nodes;
        //alert(cube[13]);

        //scene.removeMesh(children[i]);
    };

    this.rotateCube = function (targetNode, faceId, direction)
    {
        var faceClicked = this.cubeMap.findFace(targetNode, faceId);
        var sideName = faceClicked.parentSide.name;
        var cube = this.cubeMap.cube;


        var axisPointer;
        if(direction == "UP" || direction == "DOWN")
            axisPointer = faceClicked.axisX;
        else
            axisPointer = faceClicked.axisY;


        // binding Children
        var children;
        if (axisPointer instanceof HackPointer)
        {

            if (sideName == "FRONT" || sideName == "BACK")
            {
                if (direction == "UP" || direction == "DOWN")
                    children = axisPointer.childrenX;
                else
                    children = axisPointer.childrenY;
            }
            else if (sideName == "LEFT" || sideName == "RIGHT")
            {
                if (direction == "UP" || direction == "DOWN")
                    children = axisPointer.childrenZ;
                else
                    children = axisPointer.childrenY;
            }
            else
            {
                if (direction == "UP" || direction == "DOWN")
                    children = axisPointer.childrenX;
                else
                    children = axisPointer.childrenZ;
            }
            for (var j = 0; j < 8; j++)
                children[j].parent = cube[13];
        }
        else
        {
            children = axisPointer.targetSide.nodes;
            for (var i = 0; i < children.length; i++)
            {
                //if (i != 4)
                children[i].parent = cube[13];
            }
        }

        /**
         *  Left  -> x, Right -> x  hack(v)F,B -> x, hack(v)U,D -> x
         *  Up    -> y, Down  -> y, hack(h)F,B -> y, hack(h)L,R -> y
         *  Front -> z, Back ->  z, hack(v)L,R -> z, hack(h)U,D -> z,
         **/



        if (axisPointer.name == "LEFT" || axisPointer.name == "RIGHT")
        {
            this.rotateAnimation(cube[13].position.x, cube[13], direction, "rotation.x", children);
        }
        else if (axisPointer.name == "UP" || axisPointer.name == "DOWN")
        {
            this.rotateAnimation(cube[13].position.y, cube[13], direction, "rotation.y", children);
        }
        else if (axisPointer.name == "FRONT" || axisPointer.name == "BACK")
        {
            this.rotateAnimation(cube[13].position.z, cube[13], direction, "rotation.z", children);
        }
        else
        {   /** axisPointer is hackPointer */

            if (sideName == "FRONT" || sideName == "BACK")
            {
                if (direction == "UP" || direction == "DOWN")
                    this.rotateAnimation(cube[13].position.x, cube[13], direction, "rotation.x", children);
                else
                    this.rotateAnimation(cube[13].position.y, cube[13], direction, "rotation.y", children);
            }
            else if (sideName == "LEFT" || sideName == "RIGHT")
            {
                if (direction == "UP" || direction == "DOWN")
                    this.rotateAnimation(cube[13].position.z, cube[13], direction, "rotation.z", children);
                else
                    this.rotateAnimation(cube[13].position.y, cube[13], direction, "rotation.y", children);
            }
            else
            {
                if (direction == "UP" || direction == "DOWN")
                    this.rotateAnimation(cube[13].position.x, cube[13], direction, "rotation.x", children);
                else
                    this.rotateAnimation(cube[13].position.z, cube[13], direction, "rotation.z", children);
            }
        }

        this.cubeMap.updateMap(faceClicked, direction);
    };


    /** BABYLON.Animation()
     * pram1: name
     * pram2: property, this can be any mesh property, depending upon that you want to change
     * pram3: Frames per second : highest FPS possible in this animation.
     * pram4: Type of change. what kind of value will be modified. scaling.x is a float type
     *                          BABYLON.Animation.ANIMATIONTYPE_FLOAT
     *                          BABYLON.Animation.ANIMATIONTYPE_VECTOR2
     *                          BABYLON.Animation.ANIMATIONTYPE_VECTOR3
     *                          BABYLON.Animation.ANIMATIONTYPE_QUATERNION
     *                          BABYLON.Animation.ANIMATIONTYPE_MATRIX
     *                          BABYLON.Animation.ANIMATIONTYPE_COLOR3
     * pram5: Use previous values and increment it: BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
     *        Restart from initial value:           BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
     *        Keep their final value:               BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
     * */


    /** beginAnimation()
     * pram1:           target	    any	            The target
     * pram2:           from	    number         	The fps starting frame
     * pram3:           to	        number	        The fps ending frame
     * pram4:(optional)	loop	    boolean	        If true, the animation will loop
     *                                              (dependent upon BABYLON.Animation.ANIMATIONLOOPMODE)
     * pram5:(optional)	speedRatio	number	        default : 1. The speed ratio of this animation
     * pram6:(optional)	onAnimationEnd() => void	The function triggered on the end of the animation
     *                                              (also dependent upon ANIMATIONLOOPMODE)
     * pram7:(optional)	animatable	Animatable	    An optional specific animation
     */
        // + : turn right, - : turn left
    this.rotateAnimation = function(rotationValue, targetNode, direction, stringAxis, children)
    {
        var futureValue, animationBox;

        if (direction == "UP" || direction == "RIGHT")
            futureValue = Math.PI / 2;
        else
            futureValue = -(Math.PI / 2);

        animationBox  = new BABYLON.Animation("rotation", stringAxis, 50,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        // An array with all animation keys
        var keys = [];

        keys.push({
            frame: 0,
            value: rotationValue
        });
        keys.push({
            frame: 15,
            value: rotationValue + futureValue / 2

        });
        keys.push({
            frame: 50,
            value: rotationValue + futureValue
        });

        animationBox.setKeys(keys);
        animationBox.allowMAtricesInterpolation = false;
        // link this animation object to target object
        targetNode.animations.push(animationBox);
        // beginAnimation frame 0 ~ 100

        scene.beginAnimation(targetNode, 0, 50, false, 1, function()
        {
            switch (stringAxis.charAt(stringAxis.length -1))
            {
                case 'x':
                    for (var i = 0; i < children.length; i++)
                    {
                        children[i].parent = null;
                        children[i].rotation.x += futureValue;
                    }
                    break;
                case 'y':
                    for (var i = 0; i < children.length; i++)
                    {
                        children[i].parent = null;
                        children[i].rotation.y += futureValue;
                    }
                    break;
                case 'z':
                    for (var i = 0; i < children.length; i++)
                    {
                        children[i].parent = null;
                        children[i].rotation.z += futureValue;
                    }
                    break;
            }
        });
    };
}

function CubeMap(cube)
{
    this.cube = cube;
    this.hackPointer = new HackPointer(cube);
    this.pointerU = new Pointer("UP", cube);
    this.pointerD = new Pointer("DOWN", cube);
    this.pointerL = new Pointer("LEFT", cube);
    this.pointerR = new Pointer("RIGHT", cube);
    this.pointerF = new Pointer("FRONT", cube);
    this.pointerB = new Pointer("BACK", cube);

    this.sideUp = new Side("UP", cube, this);     // Green
    this.sideDown = new Side("DOWN", cube, this);   // Orange
    this.sideLeft = new Side("LEFT", cube, this);   // White
    this.sideRight = new Side("RIGHT", cube, this);  // Red
    this.sideFront = new Side("FRONT", cube, this);  // Blue
    this.sideBack = new Side("BACK", cube, this);   // Yellow

    this.findNode = function (node)
    {
        var sides = [this.sideUp, this.sideDown, this.sideLeft,
            this.sideRight, this.sideFront, this.sideBack];

        for (var i = 0; i < sides.length; i++)
        {
            if (sides[i].hasNode(node))
                return sides[i].hasNode(node);
        }
        return null;
    };

    // findFace gets info from canvas, then send to getFace method
    this.findFace = function (targetNode, faceId)
    {
        var sides = [this.sideUp, this.sideDown, this.sideLeft,
            this.sideRight, this.sideFront, this.sideBack];
        //alert(targetNode + " in findFace");
        //alert(faceId + " in findFace");

        for (var i = 0; i < sides.length; i++)
        {
            if (sides[i].getFace(targetNode, faceId) != null)
                return sides[i].getFace(targetNode, faceId);
        }
        return null;
    };

    this.getAxisBoxes = function ()
    {
        var cube = this.cube;
        var center = Math.floor(cube.length / 2);

        // return hack, UP, DOWN, LEFT, RIGHT, FRONT, BACK
        return [cube[center], cube[center + 9], cube[center - 9], cube[center - 1],
            cube[center + 1], cube[center + 3], cube[center - 3]];
    };

    /** when click some node, you will get faceId and targetNode
     *  then find face clicked using them*/

    /**
     *  0  1  2
     *  3  4  5
     *  6  7  8
     */

        // U -> F -> D -> B (Vertical)
        // L -> F -> R -> B (Horizon)
        // face clicked : face object in the map
        // direction : UP, DOWN, LEFT, RIGHT
    this.updateMap = function (faceClicked, direction)
    {
        // side's nodes (4 side) nodes are moving
        // side's faces
        // face follows the target node -> need to update

        // rotate center: remapping rotating line and need to update pointers
        // rotate edge  : remapping rotating line and need to remapping side
        var parentSide = faceClicked.parentSide;
        var indexOfFace =  parentSide.getIndexOfFace(faceClicked);
        var sides;

        switch (direction)
        {
            // remap        Front <- UP <- Back <- Down
            case "UP":
                sides = [this.sideFront, this.sideUp, this.sideBack, this.sideDown];
                this.updateVLine(sides, indexOfFace);
                if (indexOfFace % 3 == 1)
                    this.updatePointers(direction);
                else
                    this.updateAxisYRotated(faceClicked, indexOfFace, direction);
                break;
            // remap        Front <- Down <- Back <- Up
            case "DOWN":
                sides = [this.sideFront, this.sideDown, this.sideBack, this.sideUp];
                this.updateVLine(sides, indexOfFace);
                if (indexOfFace % 3 == 1)
                    this.updatePointers(direction);
                else
                    this.updateAxisYRotated(faceClicked, indexOfFace, direction);
                break;
            // remap        Front <- Left <- Back <- Right
            case "LEFT":
                sides = [this.sideFront, this.sideLeft, this.sideBack, this.sideRight];
                this.updateHLine(sides, indexOfFace);
                if (Math.floor(indexOfFace / 3) == 1)
                    this.updatePointers(direction);
                else
                    this.updateAxisXRotated(faceClicked, indexOfFace, direction);
                break;
            // remap        Front <- Right <- Back <- Left
            case "RIGHT":
                sides = [this.sideFront, this.sideRight, this.sideBack, this.sideLeft];
                this.updateHLine(sides, indexOfFace);
                if (Math.floor(indexOfFace / 3) == 1)
                    this.updatePointers(direction);
                else
                    this.updateAxisXRotated(faceClicked, indexOfFace, direction);
                break;
        }
        this.updateHackPointer();

    };

    // update line's mapping horizontally
    this.updateHLine = function (arrayOfSides, indexOfFace)
    {
        var sides = arrayOfSides;
        var startIndex = indexOfFace - (indexOfFace % 3);
        var tempNodes = [];
        var tempFaces = [];
        var tempFaceIds = [];

        for (var i = 0; i < sides.length - 1; i++)
        {
            for (var j = startIndex; j < startIndex + 3; j++)
            {
                if (i == 0)
                {
                    tempNodes.push(sides[i].nodes[j]);
                    tempFaces.push(sides[i].faces[j]);
                    tempFaceIds.push(sides[i].faces[j]);
                }
                sides[i].nodes[j] = sides[i + 1].nodes[j];
                sides[i].faces[j] = sides[i + 1].faces[j];
                sides[i].faces[j].id = sides[i + 1].face[j].id;
            }
        }

        for (var i = startIndex, j = 0; i < startIndex + 3 && j < 3; i++, j++)
        {
            sides[sides.length - 1].nodes[i] = tempNodes[j];
            sides[sides.length - 1].faces[i] = tempFaces[j];
            sides[sides.length - 1].faces[i].id = tempFaceIds[j];
        }
    };

    // update line's mapping vertically
    this.updateVLine = function (arrayOfSides, indexOfFace)
    {
        var sides = arrayOfSides;
        var startIndex = indexOfFace % 3;
        var tempNodes = [];
        var tempFaces = [];
        var tempFaceIds = [];

        for (var i = 0; i < sides.length - 1; i++)
        {
            for (var j = startIndex; j < 9; j += 3)
            {
                if (i == 0)
                {
                    tempNodes.push(sides[i].nodes[j]);
                    tempFaces.push(sides[i].faces[j]);
                    tempFaceIds.push(sides[i].faces[j]);
                }
                sides[i].nodes[j] = sides[i + 1].nodes[j];
                sides[i].faces[j] = sides[i + 1].faces[j];
                sides[i].faces[j].id = sides[i + 1].faces[j].id;
            }
        }

        for (var i = startIndex, j = 0; i < 9 && j < 3; i += 3, j++)
        {
            sides[sides.length - 1].nodes[i] = tempNodes[j];
            sides[sides.length - 1].faces[i] = tempFaces[j];
            sides[sides.length - 1].faces[i].id = tempFaceIds[j];
        }
    };

    this.updatePointers = function (direction)
    {
        var pointers;

        switch (direction)
        {
            // Front <- Up <- Back <- Down
            case "UP":
                pointers = [this.pointerF, this.pointerU, this.pointerB, this.pointerD];
                break;
            // Front <- Up <- Back <- Down
            case "DOWN":
                pointers = [this.pointerF, this.pointerD, this.pointerB, this.pointerU];
                break;
            // Front <- Up <- Back <- Down
            case "LEFT":
                pointers = [this.pointerF, this.pointerL, this.pointerB, this.pointerR];
                break;
            // Front <- Up <- Back <- Down
            case "RIGHT":
                pointers = [this.pointerF, this.pointerR, this.pointerB, this.pointerL];
                break;
        }

        var tempTargetSide = this.pointerF.targetSide;
        var tempTargetNode = this.pointerF.targetNode;

        for (var i = 0; i < pointers.length - 1; i++)
        {
            pointers[i].targetSide = pointers[i + 1].targetSide;
            pointers[i].targetNode = pointers[i + 1].targetNode;
        }

        pointers[pointers.length - 1].targetSide = tempTargetSide;
        pointers[pointers.length - 1].targetNode = tempTargetNode;
    };

    /**   turn left          turn right
     *
     *  2 5 8    0 1 2      0 1 2    6 3 0
     *  1 4 7 <- 3 4 5      3 4 5 -> 7 4 1
     *  0 3 6    6 7 8      6 7 8    8 5 2
     *
     *  2 -> 0              6 -> 0
     *  5 -> 1              3 -> 1
     *  8 -> 2              0 -> 2
     *  ...                 ...
     *  6 -> 8              2 -> 8
     */
        // after rotating up or down cubeMap needs to be updated
    this.updateAxisXRotated = function (faceClicked, indexOfFace, direction)
    {
        var targetSide = faceClicked.axisX.targetSide;

        var tempNodes = [];
        var tempFaces = [];
        var tempFaceIds = [];

        // the nodes have turned left
        if (indexOfFace % 3 == 0 && direction == "UP" || indexOfFace % 3 == 2 && direction == "DOWN")
        {
            for (var i = 2; i >= 0; i--)
                for (var j = i; j <= i + 6; j += 3)
                {
                    tempNodes.push(targetSide.nodes[j]);
                    tempFaces.push(targetSide.faces[j]);
                    tempFaceIds.push(targetSide.faces[j].id);
                }

            for (var i = 0; i < 9; i++)
            {
                targetSide.nodes[i] = tempNodes[i];
                targetSide.faces[i] = tempFaces[i];
                targetSide.faces[i].id = tempFaceIds[i];
            }
        }
        // the nodes have turned right
        else if (indexOfFace % 3 == 0 && direction == "DOWN" || indexOfFace % 3 == 2 && direction == "UP")
        {
            for (var i = 6; i <= 9; i++)
                for (var j = i; j >= i - 6; j -= 3)
                {
                    tempNodes.push(targetSide.nodes[j]);
                    tempFaces.push(targetSide.faces[j]);
                    tempFaceIds.push(targetSide.faces[j].id);
                }

            for (var i = 0; i < 9; i++)
            {
                targetSide.nodes[i] = tempNodes[i];
                targetSide.faces[i] = tempFaces[i];
                targetSide.faces[i].id = tempFaceIds[i];
            }
        }
    };
    // after rotating left or right cubeMap needs to be updated
    this.updateAxisYRotated = function (faceClicked, indexOfFace, direction)
    {
        var targetSide = faceClicked.axisY.targetSide;

        var tempNodes = [];
        var tempFaces = [];
        var tempFaceIds = [];

        // the nodes have turned left
        if (Math.floor(indexOfFace / 3) != 1 && direction == "RIGHT")
        {
            for (var i = 2; i >= 0; i--)
                for (var j = i; j <= i + 6; j += 3)
                {
                    tempNodes.push(targetSide.nodes[j]);
                    tempFaces.push(targetSide.faces[j]);
                    tempFaceIds.push(targetSide.faces[j].id);
                }

            for (var i = 0; i < 9; i++)
            {
                targetSide.nodes[i] = tempNodes[i];
                targetSide.faces[i] = tempFaces[i];
                targetSide.faces[i].id = tempFaceIds[i];
            }
        }
        // the nodes have turned right
        else if (Math.floor(indexOfFace / 3) != 1 && direction == "LEFT")
        {
            for (var i = 6; i <= 9; i++)
                for (var j = i; j >= i - 6; j -= 3)
                {
                    tempNodes.push(targetSide.nodes[j]);
                    tempFaces.push(targetSide.faces[j]);
                    tempFaceIds.push(targetSide.faces[j].id);
                }

            for (var i = 0; i < 9; i++)
            {
                targetSide.nodes[i] = tempNodes[i];
                targetSide.faces[i] = tempFaces[i];
                targetSide.faces[i].id = tempFaceIds[i];
            }
        }
    };

    this.updateHackPointer = function()
    {
        var newChildrenH = [];
        var newChildrenV = [];
        var hSides = [this.sideLeft, this.sideFront, this.sideRight, this.sideBack];
        var vSides = [this.sideUp, this.sideFront, this.sideDown, this.sideBack];

        for (var i = 0; i < 3; i++)
        {
            newChildrenH.push(hSides[i].nodes[3]);
            newChildrenH.push(hSides[i].nodes[4]);
            newChildrenV.push(vSides[i].nodes[1]);
            newChildrenV.push(vSides[i].nodes[4]);
        }
        newChildrenH.push(hSides[i].nodes[3]);
        newChildrenH.push(hSides[i].nodes[4]);
        newChildrenV.push(vSides[i].nodes[4]);
        newChildrenV.push(vSides[i].nodes[7]);

        this.hackPointer.ChildrenH = newChildrenH;
        this.hackPointer.ChildrenV = newChildrenV;
    }

}

CubeMap.setPointers = function(cubeMap)
{
    cubeMap.pointerU.targetSide = cubeMap.sideUp;
    cubeMap.pointerD.targetSide = cubeMap.sideDown;
    cubeMap.pointerL.targetSide = cubeMap.sideLeft;
    cubeMap.pointerR.targetSide = cubeMap.sideRight;
    cubeMap.pointerF.targetSide = cubeMap.sideFront;
    cubeMap.pointerB.targetSide = cubeMap.sideBack;
};



/** pointers UP, DOWN, LEFT, RIGHT, FRONT, BACK */
function Pointer (name, cube)
{
    this.name = name;
    this.targetSide = name;

    switch (name)
    {   case "UP":
        this.targetNode = cube[22]; // real object
        break;
        case "DOWN":
            this.targetNode = cube[4];
            break;
        case "LEFT":
            this.targetNode = cube[12];
            break;
        case "RIGHT":
            this.targetNode = cube[14];
            break;
        case "FRONT":
            this.targetNode = cube[16];
            break;
        case "BACK":
            this.targetNode = cube[10];
            break;
    }
}
function HackPointer (cube)
{
    this.name = "HACK";
    this.targetNode = cube[13];
    this.childrenX = [cube[1], cube[4], cube[7], cube[10],
        cube[16], cube[19], cube[22], cube[25]];
    this.childrenY = [cube[9], cube[10], cube[11], cube[12],
        cube[14], cube[15], cube[16], cube[17]];
    this.childrenZ = [cube[3], cube[4], cube[5], cube[12], cube[14], cube[21], cube[22], cube[23]];
}

/**
 * cube's side cubeMap has 6 sides
 * each side has relating nodes and faces
 *
 * name  : side name (UP, DOWN, LEFT, RIGHT, FRONT, BACK
 * nodes : 9 nodes (box object's address).
 * faces : 9 faces (face object's address).
 * centerNode : the center of 9 nodes
 * */

function Side(name, cube, cubeMap)
{
    this.name = name;
    this.nodes = Side.setNodes(name, cube);
    this.faces = Side.setFaces(name, cube, this, cubeMap);
    this.centerNode = this.nodes[4];


    // find out whether this side has the node. if it finds the node return it or not return null
    this.hasNode = function (node)
    {
        for (var i = 0; i < this.nodes.length; i++)
        {
            if (node === this.nodes[i])
                return this.nodes[i];
        }
        return null;
    };

    // find out whether this side has the face. if it finds the face return it or not return null
    // (the same color has same faceId so need to check both a node and faceId)
    this.getFace = function (targetNode, id)
    {
        for (var i = 0; i < this.faces.length; i++)
        {
            //alert(this.faces[i].id);
            if (targetNode === this.faces[i].targetNode
                && Math.floor(id / 2) == this.faces[i].id)
                return this.faces[i];
        }
        return null;
    };

    this.getIndexOfFace = function (face)
    {
        for (var i = 0; i < this.faces.length; i++)
        {
            if (face === this.faces[i])
                return i;
        }
        return null;
    };
}

/**
 *  Box indices
 *             ------UP-----
 *             | 18| 19| 20|
 *             | 21| 22| 23|
 *             | 24| 25| 26|
 * ----LEFT--------FRONT--------RIGHT--------BACK-----
 *| 18| 21| 24|| 24| 25| 26|| 26| 23| 20|| 20| 19| 18|
 *|  9| 12| 15|| 15| 16| 17|| 17| 14| 11|| 11| 10|  9|
 *|  0|  3|  6||  6|  7|  8||  8|  5|  2||  2|  1|  0|
 *------------------DOWN------------------------------
 *             |  6|  7|  8|
 *             |  3|  4|  5|
 *             |  0|  1|  2|
 *             -------------
 */
Side.setNodes = function (name, cube)
{
    var result = [];
    var i, j;
    switch (name)
    {
        case "UP":  // green faceId: 4

            for ( i = 18; i<= 26; i++)
                result.push(cube[i]);
            break;

        case "DOWN":    // orange faceId: 5
            for ( i = 6; i >= 0; i -= 3)
                for ( j = i; j < i + 3; j++)
                    result.push(cube[j]);
            break;

        case "LEFT":    // white faceId: 3
            for ( i = 18; i >= 0; i -= 9)
                for ( j = i; j <= i + 6; j += 3)
                    result.push(cube[j]);
            break;

        case "RIGHT":   // red faceId: 2
            for ( i = 26; i >= 8; i -= 9)
                for ( j = i; j >= i - 6; j -= 3)
                    result.push(cube[j]);
            break;

        case "FRONT":   // blue faceId: 1
            for ( i = 24; i >= 6; i -= 9)
                for ( j = i; j < i + 3; j++)
                    result.push(cube[j]);
            break;

        case "BACK":    // yellow faceId: 0
            for ( i = 20; i >= 2; i -= 9)
                for ( j = i; j > i - 3; j--)
                    result.push(cube[j]);
            break;
    }
    return result;
};


/** name*/
Side.setFaces = function (name, cube, side, cubeMap)
{
    var faces = [];

    switch (name)
    {
        case "UP":  // green faceId: 4
            faces.push(new Face(cube[18], 4, side, Side.getTargetAxes("BL", cubeMap)));
            faces.push(new Face(cube[19], 4, side, Side.getTargetAxes("BC", cubeMap)));
            faces.push(new Face(cube[20], 4, side, Side.getTargetAxes("BR", cubeMap)));
            faces.push(new Face(cube[21], 4, side, Side.getTargetAxes("CL", cubeMap)));
            faces.push(new Face(cube[22], 4, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[23], 4, side, Side.getTargetAxes("CR", cubeMap)));
            faces.push(new Face(cube[24], 4, side, Side.getTargetAxes("FL", cubeMap)));
            faces.push(new Face(cube[25], 4, side, Side.getTargetAxes("FC", cubeMap)));
            faces.push(new Face(cube[26], 4, side, Side.getTargetAxes("FR", cubeMap)));
            break;

        case "DOWN":    // orange faceId: 5
            faces.push(new Face(cube[6], 5, side, Side.getTargetAxes("FL", cubeMap)));
            faces.push(new Face(cube[7], 5, side, Side.getTargetAxes("FC", cubeMap)));
            faces.push(new Face(cube[8], 5, side, Side.getTargetAxes("FR", cubeMap)));
            faces.push(new Face(cube[3], 5, side, Side.getTargetAxes("CL", cubeMap)));
            faces.push(new Face(cube[4], 5, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[5], 5, side, Side.getTargetAxes("CR", cubeMap)));
            faces.push(new Face(cube[0], 5, side, Side.getTargetAxes("BL", cubeMap)));
            faces.push(new Face(cube[1], 5, side, Side.getTargetAxes("BC", cubeMap)));
            faces.push(new Face(cube[2], 5, side, Side.getTargetAxes("BR", cubeMap)));
            break;

        case "LEFT":    // white faceId: 3
            faces.push(new Face(cube[18], 3, side, Side.getTargetAxes("UB", cubeMap)));
            faces.push(new Face(cube[21], 3, side, Side.getTargetAxes("UC", cubeMap)));
            faces.push(new Face(cube[24], 3, side, Side.getTargetAxes("UF", cubeMap)));
            faces.push(new Face(cube[9], 3, side, Side.getTargetAxes("CB", cubeMap)));
            faces.push(new Face(cube[12], 3, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[15], 3, side, Side.getTargetAxes("CF", cubeMap)));
            faces.push(new Face(cube[0], 3, side, Side.getTargetAxes("DB", cubeMap)));
            faces.push(new Face(cube[3], 3, side, Side.getTargetAxes("DC", cubeMap)));
            faces.push(new Face(cube[6], 3, side, Side.getTargetAxes("DF", cubeMap)));
            break;

        case "RIGHT":   // red faceId: 2
            faces.push(new Face(cube[26], 2, side, Side.getTargetAxes("UF", cubeMap)));
            faces.push(new Face(cube[23], 2, side, Side.getTargetAxes("UC", cubeMap)));
            faces.push(new Face(cube[20], 2, side, Side.getTargetAxes("UB", cubeMap)));
            faces.push(new Face(cube[17], 2, side, Side.getTargetAxes("CF", cubeMap)));
            faces.push(new Face(cube[14], 2, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[11], 2, side, Side.getTargetAxes("CB", cubeMap)));
            faces.push(new Face(cube[8], 2, side, Side.getTargetAxes("DF", cubeMap)));
            faces.push(new Face(cube[5], 2, side, Side.getTargetAxes("DC", cubeMap)));
            faces.push(new Face(cube[2], 2, side, Side.getTargetAxes("DB", cubeMap)));
            break;

        case "FRONT":   // blue faceId: 1
            faces.push(new Face(cube[24], 1, side, Side.getTargetAxes("UL", cubeMap)));
            faces.push(new Face(cube[25], 1, side, Side.getTargetAxes("UC", cubeMap)));
            faces.push(new Face(cube[26], 1, side, Side.getTargetAxes("UR", cubeMap)));
            faces.push(new Face(cube[15], 1, side, Side.getTargetAxes("CL", cubeMap)));
            faces.push(new Face(cube[16], 1, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[17], 1, side, Side.getTargetAxes("CR", cubeMap)));
            faces.push(new Face(cube[6], 1, side, Side.getTargetAxes("DL", cubeMap)));
            faces.push(new Face(cube[7], 1, side, Side.getTargetAxes("DC", cubeMap)));
            faces.push(new Face(cube[8], 1, side, Side.getTargetAxes("DR", cubeMap)));
            break;

        case "BACK":    // yellow faceId: 0
            faces.push(new Face(cube[20], 0, side, Side.getTargetAxes("UR", cubeMap)));
            faces.push(new Face(cube[19], 0, side, Side.getTargetAxes("UC", cubeMap)));
            faces.push(new Face(cube[18], 0, side, Side.getTargetAxes("UL", cubeMap)));
            faces.push(new Face(cube[11], 0, side, Side.getTargetAxes("CR", cubeMap)));
            faces.push(new Face(cube[10], 0, side, Side.getTargetAxes("CC", cubeMap)));
            faces.push(new Face(cube[9], 0, side, Side.getTargetAxes("CL", cubeMap)));
            faces.push(new Face(cube[2], 0, side, Side.getTargetAxes("DR", cubeMap)));
            faces.push(new Face(cube[1], 0, side, Side.getTargetAxes("DC", cubeMap)));
            faces.push(new Face(cube[0], 0, side, Side.getTargetAxes("DL", cubeMap)));
            break;
    }
    return faces;
};
Side.getTargetAxes = function (codeString, cubeMap)
{
    var result = [];

    for (var i = 0; i < 2; i++)
    {
        switch (codeString.charAt(i))
        {
            case 'C':
                result.push(cubeMap.hackPointer);
                break;
            case 'U':
                result.push(cubeMap.pointerU);
                break;
            case 'D':
                result.push(cubeMap.pointerD);
                break;
            case 'L':
                result.push(cubeMap.pointerL);
                break;
            case 'R':
                result.push(cubeMap.pointerR);
                break;
            case 'F':
                result.push(cubeMap.pointerF);
                break;
            case 'B':
                result.push(cubeMap.pointerB);
                break;
        }
    }
    return result;
};
/**
 * To find out which place is clicked on the cube
 * need 2 object node and faceId
 * Each node(Box) shows 1~3 faces
 *
 * same colors have the same faceIds
 *
 * face has 2 pointers (axisY, axisX)
 * pointer is an object that is pointing one of 6 the center node
 * UP, DOWN, LEFT, RIGHT, FRONT, BACK
 */
function Face(targetNode, id, parentSide, pointers)
{
    // for identity check id and parent Node because nodes cannot have the same face ids
    this.targetNode = targetNode;
    this.id = id;
    this.parentSide = parentSide;
    this.axisY = pointers[0];       // axisY box
    this.axisX = pointers[1];       // axisX box

    this.getInfo = function ()
    {
        return "targetNode: " + this.targetNode + ", id: " + this.id + ", parentSide: " + this.parentSide.name;
    }
}