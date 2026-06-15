vcl 4.0;

backend default {
    .host = "herbarium";
    .port = "3001";
}

acl purge {
    "localhost";
    "127.0.0.1";
}

sub vcl_recv {
    if (req.method == "BAN") {
        if (!client.ip ~ purge) {
            return (synth(405));
        }
        if (!req.http.x-invalidate-pattern) {
            return (purge);
        }
        ban("req.url ~ " + req.http.x-invalidate-pattern);
        return (synth(200,"Ban added"));
    }

    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }

    unset req.http.Cookie;
    return (hash);
}

sub vcl_backend_response {
    if (beresp.status >= 400) {
        set beresp.ttl = 0s;
        set beresp.uncacheable = true;
        return (deliver);
    }
    set beresp.ttl = 1d;
    set beresp.http.Cache-Control = "public, max-age=86400";
    return (deliver);
}

sub vcl_deliver {
    set resp.http.Via = "herbarium-cache";

    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }
    return (deliver);
}
