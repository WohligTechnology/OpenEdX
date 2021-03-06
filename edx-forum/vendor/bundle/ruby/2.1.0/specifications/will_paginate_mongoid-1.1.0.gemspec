# -*- encoding: utf-8 -*-
# stub: will_paginate_mongoid 1.1.0 ruby lib

Gem::Specification.new do |s|
  s.name = "will_paginate_mongoid"
  s.version = "1.1.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Lucas Souza"]
  s.date = "2012-10-05"
  s.description = ""
  s.email = ["lucasas@gmail.com"]
  s.homepage = ""
  s.rubyforge_project = "will_paginate_mongoid"
  s.rubygems_version = "2.2.5"
  s.summary = "An extension that becomes possible use paginate method with Mongoid"

  s.installed_by_version = "2.2.5" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<mongoid>, [">= 2.4"])
      s.add_runtime_dependency(%q<will_paginate>, ["~> 3.0"])
    else
      s.add_dependency(%q<mongoid>, [">= 2.4"])
      s.add_dependency(%q<will_paginate>, ["~> 3.0"])
    end
  else
    s.add_dependency(%q<mongoid>, [">= 2.4"])
    s.add_dependency(%q<will_paginate>, ["~> 3.0"])
  end
end
