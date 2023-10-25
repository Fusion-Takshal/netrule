// Active / Value Analysis

function isCommunicationAnalyzable(index, communication)
{
    var host = communication.getHost();

    if (host == "<URL>")
    {
        var request = communication.getRequest();

        if (request != null)
        {
            var header = request.getHeader();

            var headerValues = getHeaderValues(header);

            var method = headerValues[0];

            var resource = headerValues[1];

            if (resource.startsWith("<Resource>"))
            {
                return true;
            }
        }
    }

    return false;
}

function analyzeHeaders(index, base, host, request, response)
{
    var type = interfazeProcessor.getRequestHeaderType(index);
    var parameters = interfazeProcessor.getRequestHeaderParameters(index);

    if (parameters != null)
    {
        for (var i=0; i<parameters.length; i++)
        {
            var parameter = parameters[i];

            var name = parameter.getName();

            var value = parameter.getValue();

            analyzeHeader(base, host, request, response, type, name, value);
        }
    }
}

function analyzeSelectedHeaders(index, base, host, request, response, items)
{
    var type = interfazeProcessor.getRequestHeaderType(index);
    var parameters = interfazeProcessor.getRequestHeaderParameters(index);

    if (parameters != null)
    {
        for (var i=0; i<parameters.length; i++)
        {
            if (i in items)
            {
                var parameter = parameters[i];

                var name = parameter.getName();

                var value = parameter.getValue();

                analyzeHeader(base, host, request, response, type, name, value);
            }
        }
    }
}

function analyzeHeader(base, host, request, response, type, name, value)
{
    if (name != null && value != null)
    {
        analyzeItem(base, host, request, response, type, name, value);
    }
}

function analyzeContents(index, base, host, request, response)
{
    var type = interfazeProcessor.getRequestContentType(index);
    var parameters = interfazeProcessor.getRequestContentParameters(index);

    if (parameters != null)
    {
        for (var i=0; i<parameters.length; i++)
        {
            var parameter = parameters[i];

            var name = parameter.getName();

            var value = parameter.getValue();

            analyzeContent(base, host, request, response, type, name, value);
        }
    }
}

function analyzeSelectedContents(index, base, host, request, response, items)
{
    var type = interfazeProcessor.getRequestContentType(index);
    var parameters = interfazeProcessor.getRequestContentParameters(index);

    if (parameters != null)
    {
        for (var i=0; i<parameters.length; i++)
        {
            if (i in items)
            {
                var parameter = parameters[i];

                var name = parameter.getName();

                var value = parameter.getValue();

                analyzeContent(base, host, request, response, type, name, value);
            }
        }
    }
}

function analyzeContent(base, host, request, response, type, name, value)
{
    if (name != null && value != null)
    {
        analyzeItem(base, host, request, response, type, name, value);
    }
}

function analyzeItem(base, host, request, response, type, name, value)
{
    var parameterAnalysis = initiateParameterAnalysis(name, value);

    if (parameterAnalysis)
    {
        analyzeParameter(name, value);

        var analysisItems = getAnalysisValueItems();

        var analysisPoints = getAnalysisFlowPoints();

        printAnalysisValueItems(analysisItems);

        if (isAnalysisActive())
        {
            var alternates = change(host, request, type, name, value);

            for (var i=0; i<alternates.length; i++)
            {
                var alternate = alternates[i];

                var parameterActiveAnalysis = initiateParameterActiveAnalysis(name, value, alternate);

                if (parameterActiveAnalysis)
                {
                    var analysisResponse = response;

                    var analysisActiveResponse = playParameterActive(base, host, request, response, type, name, value, alternate);

                    if (analysisActiveResponse != null)
                    {
                        analyzeParameterActive(name, value, alternate);

                        var analysisActiveItems = getAnalysisActiveValueItems();

                        var analysisActivePoints = getAnalysisActiveFlowPoints();

                        printAnalysisActiveValueItems(analysisActiveItems);

                        printAnalysisDifferentialResponse(analysisResponse, analysisActiveResponse);

                        printAnalysisDifferentialPoints(analysisPoints, analysisActivePoints);
                    }
                }
            }
        }
    }
}

function analyzeHeadersRegion(index, base, host, request, response, idx, len, value)
{
    var type = interfazeProcessor.getRequestHeaderType(index);

    analyzeHeaderRegion(base, host, request, response, type, idx, len, value)
}

function analyzeHeaderRegion(base, host, request, response, type, idx, len, value)
{
    analyzeItemRegion(base, host, request, response, type, idx, len, value);
}

function analyzeContentsRegion(index, base, host, request, response, idx, len, value)
{
    var type = interfazeProcessor.getRequestContentType(index);

    analyzeContentRegion(base, host, request, response, type, idx, len, value)
}

function analyzeContentRegion(base, host, request, response, type, idx, len, value)
{
    analyzeItemRegion(base, host, request, response, type, idx, len, value);
}

function analyzeItemRegion(base, host, request, response, type, idx, len, value)
{
    var _value_ = decode(type, value);

    var valueAnalysis = initiateValueAnalysis(_value_);

    if (valueAnalysis)
    {
        analyzeValue(_value_);

        var analysisItems = getAnalysisValueItems();

        var analysisPoints = getAnalysisFlowPoints();

        printAnalysisValueItems(analysisItems);

        if (isAnalysisActive())
        {
            var alternates = changeRegion(host, request, type, value);

            for (var i=0; i<alternates.length; i++)
            {
                var alternate = alternates[i];

                var _alternate_ = decode(type, alternate);

                var valueActiveAnalysis = initiateValueActiveAnalysis(_value_, _alternate_);

                if (valueActiveAnalysis)
                {
                    var analysisResponse = response;

                    var analysisActiveResponse = playValueActive(base, host, request, response, type, idx, len, value, alternate);

                    if (analysisActiveResponse != null)
                    {
                        analyzeValueActive(_value_, _alternate_);

                        var analysisActiveItems = getAnalysisActiveValueItems();

                        var analysisActivePoints = getAnalysisActiveFlowPoints();

                        printAnalysisActiveValueItems(analysisActiveItems);

                        printAnalysisDifferentialResponse(analysisResponse, analysisActiveResponse);

                        printAnalysisDifferentialPoints(analysisPoints, analysisActivePoints);
                    }
                }
            }
        }
    }
}

function decode(type, value)
{
    return unescape(value);
}

function encode(type, value)
{
    return escape(value);
}

function analyzeCustom(value)
{
    var valueAnalysis = initiateValueAnalysis(value);

    if (valueAnalysis)
    {
        analyzeValue(value);

        var analysisItems = getAnalysisValueItems();

        var analysisPoints = getAnalysisFlowPoints();

        printAnalysisValueItems(analysisItems);
    }
}

// Active Analysis

function change(host, request, type, name, value)
{
    var alternates = [];

    alternates.push(value);

    alternates.push(value + "'");

    alternates.push(value + "\"");

    alternates.push(value + "<");

    alternates.push(value + ">");

    return alternates;
}

function changeRegion(host, request, type, value)
{
    var alternates = [];

    alternates.push(value);

    alternates.push(value + encode(type, "'"));

    alternates.push(value + encode(type, "\""));

    alternates.push(value + encode(type, "<"));

    alternates.push(value + encode(type, ">"));

    return alternates;
}

function session(host, request)
{
    return request;
}

// Value Analysis

function valueFile()
{
    return false;
}

function valueImage()
{
    return false;
}

function valueTrace()
{
    return 7;
}

function categorizeValueCall(component, func, signature, item)
{
    return "CALL";
}

// Flow Analysis

function processFlowItem(type, event)
{
    if (type != "")
    {
        if (type != "FX")
        {
            var color = "orange";

            printFlowItem(color, type, event);
        }
    }
}

// Sink Analysis

function sinkFile()
{
    return true;
}

function sinkImage()
{
    return true;
}

function sinkTrace()
{
    return 7;
}

function analyzeSinks()
{
    var sinkAnalysis = initiateSinkAnalysis();

    if (sinkAnalysis)
    {
        analyzeSink();

        var analysisItems = getAnalysisSinkItems();

        analysisItems = processAnalysisSinkItems(analysisItems);

        printAnalysisSinkItems(analysisItems);
    }
}

function processSink(category, color, item)
{
    return category;
}

// Source Analysis

function sourceFile()
{
    return true;
}

function sourceImage()
{
    return true;
}

function sourceTrace()
{
    return 7;
}

function analyzeSources()
{
    var sourceAnalysis = initiateSourceAnalysis();

    if (sourceAnalysis)
    {
        analyzeSource();

        var analysisItems = getAnalysisSourceItems();

        analysisItems = processAnalysisSourceItems(analysisItems);

        printAnalysisSourceItems(analysisItems);
    }
}

function processSource(category, color, item)
{
    return category;
}

// Structure Analysis

function structureFile()
{
    return true;
}

function structureImage()
{
    return true;
}

function structureDisplay()
{
    return true;
}

function sinkCategories()
{
    var categories = [];

    if (args.length != 0)
    {
        categories = args;
    }
    else
    {
        categories.push("STR");
    }

    return categories;
}

function sinkSignature(category, color, signature)
{
    return true;
}

function sinkProcess(category, color, item)
{
    return category;
}

function sourceCategories()
{
    var categories = [];

    if (args.length != 0)
    {
        categories = args;
    }
    else
    {
    }

    return categories;
}

function sourceSignature(category, color, signature)
{
    return true;
}

function sourceProcess(category, color, item)
{
    return category;
}
