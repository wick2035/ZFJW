 

    // ==UserScript==
    // @name         方正教务系统成绩分项下载
    // @namespace    ikaikail@ikaikail.com
    // @version      2.0
    // @description  Download performance items from the Founder Educational Administration System
    // @author       iKaiKail
    // @match        *://jwgl.sxzy.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.fafu.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.whvcse.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.whu.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl8.ujn.edu.cn/jwglxt/cjcx/*
    // @match        *://authserver.mju.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.nwnu.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.cauc.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.njtech.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.njucm.edu.cn/jwglxt/cjcx/*
    // @match        *://jwgl.hx.cn/jwglxt/cjcx/*
    // @match        *://jwmis.cfec.edu.cn/jwglxt/cjcx/*
    // @match        *://211.69.159.74/jwglxt/cjcx/*
    // @icon         https://www.zfsoft.com/img/zf.ico
    // @grant        none
    // @require      https://code.jquery.com/jquery-3.6.0.min.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // 创建下载按钮
        const createDownloadButton = () => {
            return $('<button>', {
                type: 'button',
                class: 'btn btn-primary btn-sm mx-2',
                text: '导出所有成绩'
            });
        };
     
        // 文件下载器
        const downloadFile = (blob, filename = `成绩单_${Date.now()}.xlsx`) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };
     
        // 处理导出请求
        const handleExport = async () => {
            try {
                const xnm = document.getElementById('xnm').value;
                const xqm = document.getElementById('xqm').value;
     
                // 构建符合服务器要求的参数列表
                const params = new URLSearchParams([
                    ['gnmkdmKey', 'N305005'],
                    ['xnm', xnm],
                    ['xqm', xqm],
                    ['dcclbh', 'JW_N305005_GLY'],
                    ...[
                        'kcmc@课程名称',
                        'xnmmc@学年',
                        'xqmmc@学期',
                        'kkbmmc@开课学院',
                        'kch@课程代码',
                        'jxbmc@教学班',
                        'xf@学分',
                        'xmcj@成绩',
                        'xmblmc@成绩分项'
                    ].map(col => ['exportModel.selectCol', col]),
                    ['exportModel.exportWjgs', 'xls'],
                    ['fileName', '成绩单']
                ]);
     
                const response = await fetch('/jwglxt/cjcx/cjcx_dcXsKccjList.html', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params
                });
     
                if (!response.ok) {
                    throw new Error(`服务器返回异常状态码: ${response.status}`);
                }
     
                const blob = await response.blob();
                downloadFile(blob);
            } catch (error) {
                console.error('导出操作失败:', error);
                alert(`导出失败: ${error.message}`);
            }
        };
     
        // 初始化功能
        const init = () => {
            const $searchButton = $('#search_go');
            const $downloadButton = createDownloadButton()
                .click(handleExport)
                .prop('title', '导出包含所有成绩分项的完整数据');
     
            $searchButton.length > 0 ?
                $searchButton.after($downloadButton) :
                $('body').prepend($downloadButton);
        };
     
        // 等待页面主要元素加载完成
        const checkDOM = () => {
            if (document.getElementById('xnm') && document.getElementById('xqm')) {
                init();
            } else {
                setTimeout(checkDOM, 300);
            }
        };
     
        // 启动检测
        checkDOM();
    })();

