import tls from "tls";

// Direct TLS handshake to read the certificate issuer — no third-party API.
export function getCertificateIssuer(hostname, { timeoutMs = 5000 } = {}) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, timeout: timeoutMs, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        if (!cert || !cert.issuer) return resolve(null);
        resolve(cert.issuer.O || cert.issuer.CN || null);
      }
    );
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}
