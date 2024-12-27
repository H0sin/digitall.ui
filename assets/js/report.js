import * as main from "./main.js";


$(document).ready(async function () {
   await main.showLoading();

    if ($('#weeklySalesChartRTL').length) {

        let endDate = new Date();
        let startDate = new Date(endDate - (7 * 24 * 60 * 60 * 1000));

        endDate = endDate.toLocaleDateString("de-DE").split(".").reverse().join("/");
        startDate = startDate.toLocaleDateString("de-DE").split(".").reverse().join("/");

        await main.getDigitallApi(`/Agent/InputUserReport?takeEntity=0&startDate=${startDate}&endDate=${endDate}`)
            .then(({data}) => {

                let categories = [];
                let count = [];
                data.entities.forEach(entity => {
                    categories.push(entity.date.split("T")[0].replaceAll("-", "/"));
                    count.push(entity.count);
                });
                // console.log(categories);

                var options = {
                    chart: {
                        type: 'bar',
                        height: '400',
                        parentHeightOffset: 0,
                        foreColor: main.colors.bodyColor,
                        background: main.colors.cardBg,
                        toolbar: {
                            show: false
                        },
                    },
                    theme: {
                        mode: 'light'
                    },
                    tooltip: {
                        theme: 'light'
                    },
                    colors: [main.colors.primary],
                    fill: {
                        opacity: .9
                    } ,
                    grid: {
                        padding: {
                            bottom: -4
                        },
                        borderColor: main.colors.gridBorder,
                        xaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    series: [{
                        name: 'عضویت',
                        data: count
                    }],
                    xaxis: {
                        type: 'datetime',
                        categories,
                        axisBorder: {
                            color: main.colors.gridBorder,
                        },
                        axisTicks: {
                            color: main.colors.gridBorder,
                        },
                    },
                    yaxis: {
                        opposite: true,
                        title: {
                            text: 'تعداد فروش',
                            offsetX: -5,
                            style:{
                                size: 9,
                                color: main.colors.muted
                            }
                        },
                        labels: {
                            align: 'left',
                            offsetX: 10,
                        }
                    },
                    legend: {
                        show: true,
                        position: "top",
                        horizontalAlign: 'center',
                        fontFamily: main.fontFamily,
                        itemMargin: {
                            horizontal: 8,
                            vertical: 0
                        },
                    },
                    stroke: {
                        width: 0
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '10px',
                            fontFamily: main.fontFamily,

                        },
                        offsetY: -18,
                        offsetX: -2,
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "10%",
                            borderRadius: 4,
                            dataLabels: {
                                position: 'top',
                                orientation: 'vertical',
                            }
                        },
                    },
                }
                var chart = new ApexCharts(document.querySelector("#weeklySalesChartRTL"), options);
                chart.render();
            })
    }
   await main.hiddenLoading();

});