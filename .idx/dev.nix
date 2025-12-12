{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.docker
    pkgs.docker-compose
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
  ];
  services.docker.enable = true;
  idx = {
    extensions = [
      "rangav.vscode-thunder-client"
    ];
    workspace = {
      onCreate = {
        install = "pnpm install";
      };
      onStart = {
      };
    };
  };
}
