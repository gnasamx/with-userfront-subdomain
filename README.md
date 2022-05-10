### With userfront subdomain

**Steps to reproduce:**

1. Install project with `yarn` and start the dev server with `yarn dev`
2. Open '/signup'

3. The Company name is the important field. To simulate subdomain on localhost update the host file.

4. To update the host file on macos: run `sudo vim /etc/hosts`
5. Add subdomain entry

```diff
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

+127.0.0.1       flow.localhost
+127.0.0.1       openphone.localhost
```

7. Once you submit the form, you will be redirected to your subdomain, in this case, if the company name is 'OpenPhone' then 'http://openphone.localhost:3000'

**Issue:**

1. Cookie domain name is "localhost" or in production "example".
2. Because of which there is no session on subdomain.

**Expectation:**

1. Cookie domain name should be ".localhost" or in production ".example".
2. Such that session can be maintained on both domain and subdomain.
