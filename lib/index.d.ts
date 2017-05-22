/// <reference types="request" />
import * as requestLib from "request";
export declare namespace inkstone {
    interface InkstoneConfig {
        baseUrl?: string;
        baseShareUrl?: string;
        haikuBinaryPath?: string;
    }
    function setConfig(newVals: InkstoneConfig): void;
    type Callback<T> = (err: string, data: T, response: requestLib.RequestResponse) => void;
    namespace user {
        interface Authentication {
            Expiration: string;
            Token: string;
        }
        function authenticate(username: any, password: any, cb: inkstone.Callback<Authentication>): void;
    }
    namespace invite {
        interface Invite {
            Code: string;
        }
        interface InviteClaim {
            Code: string;
            Email: string;
            Password: string;
            OrganizationName?: string;
        }
        function checkValidity(code: string, cb: inkstone.Callback<boolean>): void;
        function claimInvite(claim: InviteClaim, cb: inkstone.Callback<boolean>): void;
    }
    namespace organization {
        interface Organization {
            Name: string;
        }
        function list(authToken: string, cb: inkstone.Callback<Organization[]>): void;
    }
    namespace snapshot {
        interface Snapshot {
            UniqueId: string;
            GitTag?: string;
            GitSha?: string;
        }
        interface SnapshotAndProjectAndOrganization {
            Snapshot: Snapshot;
            Project: project.Project;
            Organization: organization.Organization;
        }
        function awaitSnapshotLink(id: string, cb: inkstone.Callback<string>, recursionIncr?: number): void;
        function getSnapshotAndProject(id: string, cb: inkstone.Callback<SnapshotAndProjectAndOrganization>): void;
    }
    namespace project {
        interface Project {
            Name: string;
            GitRemoteUrl: string;
            GitRemoteName: string;
            GitRemoteArn: string;
        }
        interface Credentials {
            Username: string;
            CodeCommitHttpsUsername: string;
            CodeCommitHttpsPassword: string;
        }
        interface ProjectAndCredentials {
            Project: Project;
            Credentials: Credentials;
        }
        interface ProjectCreateParams {
            Name: string;
        }
        function create(authToken: string, params: ProjectCreateParams, cb: inkstone.Callback<Project>): void;
        function list(authToken: string, cb: inkstone.Callback<Project[]>): void;
        function getByName(authToken: string, name: string, cb: inkstone.Callback<ProjectAndCredentials>): void;
        function deleteByName(authToken: string, name: string, cb: inkstone.Callback<boolean>): void;
    }
}
