window.addEventListener('DOMContentLoaded', function() {
    Sortable.create(dashGrid, { 
        handle: '.handle',
        swapThreshold: 1,
        animation: 150,
    });

    const swiper_item1 = new Swiper('.swiper-container.item-1', {
        navigation: {
            nextEl: '.swiper-button-next.item-1',
            prevEl: '.swiper-button-prev.item-1',
        },
    });

    const swiper_item5 = new Swiper('.swiper-container.item-5', {
        navigation: {
            nextEl: '.swiper-button-next.item-5',
            prevEl: '.swiper-button-prev.item-5',
        },
    });

    createGraphInfo();
    createYoutubeInfo();
});

function createGraphInfo() {
    //const data = [102, 222, 1233, 2344, 235, 26, 17];
    //const date = ['일', '월', '화', '수', '목', '금', '토'];

    //const data = [200291, 400291, 100291, 500291, 220201];
    //const date = ['10월-1째', '10월-2째', '10월-3째', '10월-4째', '10월-5째'];

    const data = [200291, 400291, 100291, 500291, 220201, 200291, 400291, 100291, 500291, 220201, 220132, 333022];
    const date = ['1월', '2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

    const width = 500, height = 250; 
    const xAxis_subLen = 80;

    const svg = d3.select('.d3Test')
                .attr("width", width)
                .attr("height", height);
    
    // x축
    const xAxis = d3.scaleBand()
    .range([0, width-xAxis_subLen])
    .domain(date);
    
    svg.append("g")
        .attr("transform", "translate(50, 230)")
        .call(d3.axisBottom(xAxis))

    // y축
    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height-50]);

    const yAxis = d3.scaleLinear()
    .range([height-50, 0])
    .domain([0, d3.max(data)]);
    
    svg.append("g")
    .attr("transform", "translate(50, 30)")
    .call(d3.axisLeft(yAxis));

    // 색상
    var colors = d3.scaleQuantize()
    .domain([0,d3.max(data)])
    .range(["#5CBD69", "#2A8636", "#02BA1A", "#016E10", "#013D09"]);
          
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attr("fill", function(d) {
            return colors(d);
        })
        .attr('width', function(d) {
            return 20;
        })
        .attr('height', function(d) {
            return yScale(d);
        })
        .attr('x', function(d, i) {
            return 50 + ((width-xAxis_subLen)/date.length/2 - 10) +((width-xAxis_subLen)/date.length)*i;
        })
        .attr('y', function(d, i) {
            return 230 - yScale(d);
        })
        .attr('num', function(d, i) {
            return i;
        })
        .on('mouseover', function(d) {
            // 텍스트
            d3.select(this)
            .attr('fill', 'orange');

            const idx = parseInt(d3.select(this).attr('num'));
            const value = data[idx];
            d3.select('#tooltip')
            .select('#value')
            .text(value);
            
            const xPos = 50 - (String(value).length*2.5-2) + ((width-xAxis_subLen)/date.length/2 - 10) +((width-xAxis_subLen)/date.length)*idx;
            const yPos = 225 - yScale(value);
            d3.select('#tooltip')
            .attr('style', `left:${xPos}px; top:${yPos}px`);

            d3.select('#tooltip').classed('hidden', false);
        })
        .on('mouseout', function(d) {
            const idx = parseInt(d3.select(this).attr('num'));
            const value = data[idx];
            d3.select(this)
            .attr('fill', () => colors(value));

            d3.select('#tooltip').classed('hidden', true);
        });
}

function getGraphData(/*userinfo, date*/) {
/*
이번주(7개) 까지의 데이터 (걸음수/허리둘레/과식)
이번달(최대 5개) 까지의 데이터 (걸음수/허리둘레/과식)
이번년(최대 12개) 까지의 데이터 (걸음수/허리둘레/과식) */
}

function createYoutubeInfo() {
    let innerhtml = ``;
    innerhtml = JSON.stringify(youtube_info);

    document.querySelector('#item6 > .grid-section').innerHTML = innerhtml;
}