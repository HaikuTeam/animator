"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestLib = require("request");
var _ = require("lodash");
var ENDPOINTS = {
    PROJECT_CREATE: "v0/project",
    LOGIN: "v0/user/auth",
    CHANGE_PASSWORD: "v0/user/password",
    ORGANIZATION_LIST: "v0/organization",
    PROJECT_LIST: "v0/project",
    INVITE_PREFINERY_CHECK: "v0/invite/check",
    INVITE_CHECK: "v0/invite/:CODE",
    INVITE_CLAIM: "v0/invite/claim",
    SNAPSHOT_GET_BY_ID: "v0/snapshot/:ID",
    PROJECT_GET_BY_NAME: "v0/project/:NAME",
    PROJECT_DELETE_BY_NAME: "v0/project/:NAME",
};
var request = requestLib.defaults({
    strictSSL: false
});
var inkstone;
(function (inkstone) {
    var _inkstoneConfig = {
        baseUrl: "https://inkstone.haiku.ai/",
        baseShareUrl: "https://share.haiku.ai/",
        haikuBinaryPath: "/Applications/Haiku.app/Contents/MacOS/Haiku"
    };
    function setConfig(newVals) {
        _.extend(_inkstoneConfig, newVals);
    }
    inkstone.setConfig = setConfig;
    var user;
    (function (user) {
        function authenticate(username, password, cb) {
            var formData = {
                username: username,
                password: password
            };
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.LOGIN,
                json: formData,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            request.post(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var auth = body;
                    cb(undefined, auth, httpResponse);
                }
                else {
                    cb(err, undefined, httpResponse);
                }
            });
        }
        user.authenticate = authenticate;
        function changePassword(authToken, params, cb) {
            var options = {
                strictSSL: false,
                url: _inkstoneConfig.baseUrl + ENDPOINTS.CHANGE_PASSWORD,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                },
                json: params
            };
            request.post(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var response = body;
                    cb(undefined, response, httpResponse);
                }
                else {
                    var response = body;
                    cb(response, undefined, httpResponse);
                }
            });
        }
        user.changePassword = changePassword;
    })(user = inkstone.user || (inkstone.user = {}));
    var invite;
    (function (invite) {
        var Validity;
        (function (Validity) {
            Validity[Validity["VALID"] = 0] = "VALID";
            Validity[Validity["INVALID"] = 1] = "INVALID";
            Validity[Validity["ALREADY_CLAIMED"] = 2] = "ALREADY_CLAIMED";
            Validity[Validity["ERROR"] = 3] = "ERROR";
        })(Validity = invite.Validity || (invite.Validity = {}));
        function getInviteFromPrefineryCode(params, cb) {
            var options = {
                strictSSL: false,
                url: _inkstoneConfig.baseUrl + ENDPOINTS.INVITE_PREFINERY_CHECK,
                headers: {
                    "Content-Type": "application/json",
                },
                json: params
            };
            request.post(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var project = body;
                    cb(undefined, project, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        invite.getInviteFromPrefineryCode = getInviteFromPrefineryCode;
        function checkValidity(code, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CHECK.replace(":CODE", code),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            request.get(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var invitePreset = JSON.parse(body);
                    invitePreset.Valid = Validity.VALID;
                    cb(undefined, invitePreset, httpResponse);
                }
                else {
                    if (httpResponse && httpResponse.statusCode === 404) {
                        cb("invalid code", { Valid: Validity.INVALID }, httpResponse);
                    }
                    else if (httpResponse && httpResponse.statusCode === 410) {
                        cb("code already claimed", { Valid: Validity.ALREADY_CLAIMED }, httpResponse);
                    }
                    else {
                        cb("uncategorized error", { Valid: Validity.ERROR }, httpResponse);
                    }
                }
            });
        }
        invite.checkValidity = checkValidity;
        function claimInvite(claim, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CLAIM,
                json: claim,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            request.post(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    cb(undefined, true, httpResponse);
                }
                else {
                    var errMessage = body;
                    cb(errMessage, undefined, httpResponse);
                }
            });
        }
        invite.claimInvite = claimInvite;
    })(invite = inkstone.invite || (inkstone.invite = {}));
    var organization;
    (function (organization) {
        function list(authToken, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.ORGANIZATION_LIST,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                }
            };
            request.get(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var projects = JSON.parse(body);
                    cb(undefined, projects, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        organization.list = list;
    })(organization = inkstone.organization || (inkstone.organization = {}));
    var snapshot;
    (function (snapshot_1) {
        function awaitSnapshotLink(id, cb, recursionIncr) {
            if (recursionIncr === void 0) { recursionIncr = 0; }
            var RETRIES = 120;
            var RETRY_PERIOD = 1000;
            if (recursionIncr >= RETRIES) {
                cb("timed out: retries exceeded", undefined, undefined);
            }
            else {
                getSnapshotAndProject(id, function (err, snap, response) {
                    if (err) {
                        cb(err, null, response);
                    }
                    else {
                        if (response.statusCode !== 200) {
                            setTimeout(function () { awaitSnapshotLink(id, cb, recursionIncr + 1); }, RETRY_PERIOD);
                        }
                        else {
                            console.log("Response", snap);
                            cb(undefined, assembleSnapshotLinkFromSnapshot(snap.Snapshot), response);
                        }
                    }
                });
            }
        }
        snapshot_1.awaitSnapshotLink = awaitSnapshotLink;
        function getSnapshotAndProject(id, cb) {
            var url = _inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_GET_BY_ID.replace(":ID", encodeURIComponent(id));
            var options = {
                url: url,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            request.get(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var snapshotAndProject = JSON.parse(body);
                    cb(undefined, snapshotAndProject, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        snapshot_1.getSnapshotAndProject = getSnapshotAndProject;
        function assembleSnapshotLinkFromSnapshot(snapshot) {
            return _inkstoneConfig.baseShareUrl + snapshot.UniqueId + "/latest";
        }
    })(snapshot = inkstone.snapshot || (inkstone.snapshot = {}));
    var project;
    (function (project_1) {
        function create(authToken, params, cb) {
            var options = {
                strictSSL: false,
                url: _inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_CREATE,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                },
                json: params
            };
            request.post(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var project = body;
                    cb(undefined, project, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        project_1.create = create;
        function list(authToken, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_LIST,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                }
            };
            request.get(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var projects = JSON.parse(body);
                    cb(undefined, projects, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        project_1.list = list;
        function getByName(authToken, name, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_GET_BY_NAME.replace(":NAME", encodeURIComponent(name)),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                }
            };
            request.get(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    var project = JSON.parse(body);
                    cb(undefined, project, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        project_1.getByName = getByName;
        function deleteByName(authToken, name, cb) {
            var options = {
                url: _inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_DELETE_BY_NAME.replace(":NAME", encodeURIComponent(name)),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "INKSTONE auth_token=\"" + authToken + "\""
                }
            };
            request.delete(options, function (err, httpResponse, body) {
                if (httpResponse && httpResponse.statusCode === 200) {
                    cb(undefined, true, httpResponse);
                }
                else {
                    cb("uncategorized error", undefined, httpResponse);
                }
            });
        }
        project_1.deleteByName = deleteByName;
    })(project = inkstone.project || (inkstone.project = {}));
})(inkstone = exports.inkstone || (exports.inkstone = {}));
//# sourceMappingURL=index.js.map