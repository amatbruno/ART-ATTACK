
(function () {
    const $canvas = document.querySelector(".c1");
    const $chatForm = document.querySelector(".chat-form");
    const context = $canvas.getContext('2d');
    const socket = io();
    let dots = [];

    const drawPoint = (x, y, clicked) => {
        dots.push({ x, y, clicked })
    }

    const reDraw = (x, y) => {
        context.clearRect(x, y, $canvas.width, $canvas.height);
        if (dots.length < 2) return requestAnimationFrame(reDraw);


        dots.forEach(({ x, y, clicked }, index) => {
            if (!clicked || !index) return;
            const { x: previousX, y: previousY } = dots[index - 1]
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(previousX, previousY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        })
        requestAnimationFrame(reDraw)
    }

    requestAnimationFrame(reDraw)


    socket.on('draw', ({ x, y, clicked }) => {
        drawPoint(x, y, clicked)
    })

    socket.on('clear', () => {
        context.clearRect(0, 0, $canvas.width, $canvas.height);
        dots = [];
    });

    fetch("/points")
        .then(res => res.json())
        .then(points => points.forEach(({ x, y, clicked }) => drawPoint(x, y, clicked)))


    $chatForm.addEventListener('submit', e => {
        e.preventDefault()
        const currentValue = document.querySelector('[name=message]').value;

        if (currentValue === '') return;

        console.log(currentValue)
    })

})()