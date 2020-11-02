window.addEventListener('DOMContentLoaded', function() {
    Sortable.create(dashGrid, { 
        handle: '.handle',
        swapThreshold: 1,
        animation: 150,
    });

    d3Test();
});

function d3Test() {
    const data = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const svg = d3.select('.d3Test');
    
    data.forEach((d, i) => {
        svg.append('rect')
            .attr('height', data[i])
            .attr('width', 40)
            .attr('x', 50 * i)
            .attr('y', 100 - data[i])
    });
}