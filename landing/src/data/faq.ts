// The landing page's questions and answers: the FAQ section shows them, and
// the page's FAQPage structured data repeats them for search engines.
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'Why Docker Swarm, and not Kubernetes?',
    answer:
      'Kubernetes is the right tool for very large clusters and teams that run a platform of their own. Most apps run on one to a few dozen servers, and there Docker Swarm does the job with much less to learn and to run: it is built into Docker, it takes little memory, and a single server is already a working cluster. HivePaaS adds what Swarm lacks on its own — builds, domains, certificates, backups, metrics and a dashboard.',
  },
  {
    question: 'What happens to my apps if HivePaaS stops?',
    answer:
      'They keep running. Each app is a plain Docker Swarm service, and Traefik keeps routing their domains from Swarm itself. While HivePaaS is down you only lose the dashboard and the work it drives, such as deployments, backups and scheduled jobs; they resume when it starts again.',
  },
  {
    question: 'Can I run it on a single server?',
    answer:
      'Yes. HivePaaS installs on one Linux server, which becomes the manager of a swarm, and more servers can join it later as workers. 4 CPUs, 8 GB of memory and a 40 GB disk are recommended; it runs on less, with less room left for your apps.',
  },
  {
    question: 'Which Linux distributions does it support?',
    answer:
      'Debian, Ubuntu and their derivatives; Fedora, RHEL, CentOS, Rocky Linux, AlmaLinux, Oracle Linux and Amazon Linux; SLES and openSUSE; Arch and Manjaro; and Alpine. The installer sets up Docker itself when it is missing.',
  },
  {
    question: 'Is HivePaaS free?',
    answer:
      'Yes, you can install it and use it for free today. Paid plans with wider limits, and an edition for larger organizations, are on the way — they will be announced on this page.',
  },
  {
    question: 'Where does my data live?',
    answer:
      'On your servers, and nowhere else. HivePaaS sends no telemetry. Backups go where you send them: a bucket on S3-compatible storage of your choice, or a volume on one of your nodes, encrypted with the repository’s password.',
  },
  {
    question: 'Can I try it before installing?',
    answer:
      'Yes. Sign in to one of the live demo servers above with the read-only demo account, and look around a real cluster: apps, functions, metrics, logs and the app store.',
  },
];
