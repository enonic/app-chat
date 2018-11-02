var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

var REPO_NAME = 'com.enonic.app.chat';
var ROOT_PERMISSIONS = [
    {
        principal: 'role:system.admin',
        allow: [
            'READ',
            'CREATE',
            'MODIFY',
            'DELETE',
            'PUBLISH',
            'READ_PERMISSIONS',
            'WRITE_PERMISSIONS'
        ],
        deny: []
    },
    {
        principal: 'role:system.authenticated',
        allow: [
            'READ',
            'CREATE'
        ],
        deny: []
    }
];


exports.init = function () {
    contextLib.run(
        {
            user: {
                login: 'su',
                userStore: 'system'
            },
            principals: ['role:system.admin']
        },
        doInitialize
    );
};


function doInitialize() {
    var result = repoLib.get(REPO_NAME);
    if (!result) {
        createRepo();
        createNodes();
        repoLib.refresh('SEARCH');
    }
};

function createRepo() {
    log.info('Creating repository [' + REPO_NAME + ']...');
    repoLib.create({
        id: REPO_NAME,
        rootPermissions: ROOT_PERMISSIONS
    });
    log.info('Repository [' + REPO_NAME + '] created');
};

var createNodes = function () {
    var repoConn = connect();
    repoConn.create({
        _name: 'channels',
        _parentPath: '/',
        _permissions: ROOT_PERMISSIONS
    });
    repoConn.create({
        _name: 'demo',
        _parentPath: '/channels',
        _permissions: ROOT_PERMISSIONS
    });
};

function connect() {
    return nodeLib.connect({
        repoId: REPO_NAME,
        branch: 'master',
    });
}


exports.connect = connect;