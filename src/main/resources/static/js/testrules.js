// Global vars
var save_method;
var table;
var frontendServiceUrl;
var defaultFormKeyValuePair = {
    "formkey": "",
    "formvalue": ""
};


jQuery(document).ready(function() {


    $('.container').on('click', 'button.upload_rules', function(event) {
        event.stopPropagation();
        event.preventDefault();

        function validateJsonAndCreateSubscriptions(subscriptionFile) {
            var reader = new FileReader();
            reader.onload = function() {
                var fileContent = reader.result;
                var jsonLintResult = "";
                try {
                    jsonLintResult = jsonlint.parse(fileContent);
                } catch (e) {
                    $.alert("JSON Format Check Failed222222:\n" + e.name + "\n" + e.message);
                    return false;
                }
                $.jGrowl('JSON Format Check Succeeded', {
                    sticky: false,
                    theme: 'Notify'
                });
                //ko.cleanNode(document.getElementById('rulesListID'));
                ko.applyBindings({
                	rulesBindingList: fileContent
                });
                //tryToCreateSubscription(rulesList);
            };
            reader.readAsText(subscriptionFile);
        }


        function createUploadWindow() {
            var pom = document.createElement('input');
            pom.setAttribute('id', 'uploadFile');
            pom.setAttribute('type', 'file');
            pom.setAttribute('name', 'upFile');
            pom.onchange = function uploadFinished() {
                var subscriptionFile = pom.files[0];
                validateJsonAndCreateSubscriptions(subscriptionFile);
            };
            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            } else {
                pom.click();
            }
        }


        function createUploadWindowMSExplorer() {
            $('#upload_rules').click();
            var file = $('#upload_rules').prop('files')[0];
            validateJsonAndCreateSubscriptions(file);
        }

        // If MS Internet Explorer -> special handling for creating download file window. 
        if (window.navigator.msSaveOrOpenBlob) {
            createUploadWindowMSExplorer();
        } else {
            // HTML5 Download File window handling
            createUploadWindow();
        }
    });

    $('.container').on('click', 'button.download_rules', function() {
        var textData = document.getElementById("rulesListID").value;
        var contentType = "application/json;charset=utf-8";
        var jsonData = JSON.stringify(JSON.parse(textData), null, 2);
        var fileName = "rules.json"

        function downloadFile(data, type, title) {
            var link = document.createElement('a');
            link.setAttribute("href", "data:" + type + "," + encodeURIComponent(data));
            link.setAttribute("download", fileName);
            link.setAttribute("class", "hidden");
            link.click();
        }

        function downloadFileMSExplorer(data, type, title) {
            var blob = new Blob([data], {type: type});
            window.navigator.msSaveOrOpenBlob(blob, title);
        }

        if (window.navigator.msSaveOrOpenBlob) {
            downloadFileMSExplorer(jsonData, contentType, fileName);
        } else {
            downloadFile(jsonData, contentType, fileName);
        }
    });

});